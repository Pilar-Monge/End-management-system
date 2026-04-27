import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InventoryMovementService } from '../inventoryMovement/inventoryMovement.service';
import { NotificationService } from '../notification/notification.service';
import { IntercampRequestRepository } from './intercampRequest.repository';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

@Injectable()
export class IntercampRequestService {
  constructor(
    private readonly repository: IntercampRequestRepository,
    private readonly notificationService: NotificationService,
    private readonly inventoryMovementService: InventoryMovementService,
  ) {}

  private async applyApprovedRequestInventory(request: IntercampRequest): Promise<void> {
    const existingTransferCount = await this.repository.countTransfersByRequestId(request.id);
    if (existingTransferCount > 0) {
      return;
    }

    const alreadyAppliedCount = await this.repository.countAppliedInventoryByRequestId(request.id);
    if (alreadyAppliedCount > 0) {
      return;
    }

    const detailRows = await this.repository.findRequestResourceAmountsByRequestId(request.id);

    if (detailRows.length === 0) {
      return;
    }

    const actorUserId = request.respondedBy ?? request.createdBy;

    for (const detail of detailRows) {
      await this.inventoryMovementService.createMovement({
        campId: request.originCampId,
        resourceTypeId: detail.resourceTypeId,
        amount: detail.amount,
        movementType: 'TRANSFER_SENT',
        sourceId: request.id,
        sourceType: 'intercamp_request',
        recordedBy: actorUserId,
        description: `Auto movement on intercamp request approval #${request.id}`,
      });

      await this.inventoryMovementService.createMovement({
        campId: request.destinationCampId,
        resourceTypeId: detail.resourceTypeId,
        amount: detail.amount,
        movementType: 'TRANSFER_RECEIVED',
        sourceId: request.id,
        sourceType: 'intercamp_request',
        recordedBy: actorUserId,
        description: `Auto movement on intercamp request approval #${request.id}`,
      });
    }
  }

  private async validateRoutingAndOwnership(
    originCampId: number,
    destinationCampId: number,
    createdBy: number,
    respondedBy?: number | null,
  ): Promise<void> {
    if (originCampId === destinationCampId) {
      throw new BadRequestException('El campamento de origen y destino deben ser diferentes');
    }

    const originCamp = await this.repository.findCampById(originCampId);
    if (!originCamp) {
      throw new NotFoundException('Campamento de origen no encontrado');
    }

    const destinationCamp = await this.repository.findCampById(destinationCampId);
    if (!destinationCamp) {
      throw new NotFoundException('Campamento de destino no encontrado');
    }

    const creatorUser = await this.repository.findUserById(createdBy);
    if (!creatorUser) {
      throw new NotFoundException('Usuario creador no encontrado');
    }

    if (creatorUser.campId !== originCampId) {
      throw new BadRequestException('El usuario creador no pertenece al campamento de origen');
    }

    if (respondedBy === null || respondedBy === undefined) {
      return;
    }

    const responderUser = await this.repository.findUserById(respondedBy);
    if (!responderUser) {
      throw new NotFoundException('Usuario que responde no encontrado');
    }

    if (responderUser.campId !== destinationCampId) {
      throw new BadRequestException(
        'El usuario que responde no pertenece al campamento de destino',
      );
    }
  }

  async createRequest(data: CreateIntercampRequestDTO): Promise<IntercampRequest> {
    await this.validateRoutingAndOwnership(
      data.originCampId,
      data.destinationCampId,
      data.createdBy,
      data.respondedBy,
    );

    const created = await this.repository.create(data);

    await this.notificationService.notifyUser(created.createdBy, {
      campId: created.originCampId,
      type: 'INTERCAMP_REQUEST_RECEIVED',
      title: 'Solicitud intercampamento creada',
      message: `Tu solicitud intercampamento #${created.id} fue registrada y enviada al campamento ${created.destinationCampId}.`,
      sourceType: 'intercamp_request',
      sourceId: created.id,
    });

    await this.notificationService.notifyCampRoles(
      created.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'INTERCAMP_REQUEST_RECEIVED',
        title: 'Nueva solicitud intercampamento',
        message: `Se recibio una solicitud intercampamento #${created.id} desde el campamento ${created.originCampId}.`,
        sourceType: 'intercamp_request',
        sourceId: created.id,
      },
    );

    return created;
  }

  async getRequestById(id: number): Promise<IntercampRequest | null> {
    return await this.repository.findById(id);
  }

  async getAllRequests(filters?: {
    originCampId?: number;
    destinationCampId?: number;
    involvedCampId?: number;
    status?: IntercampRequestStatus;
    createdBy?: number;
    respondedBy?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: IntercampRequest[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      originCampId?: number;
      destinationCampId?: number;
      involvedCampId?: number;
      status?: IntercampRequestStatus;
      createdBy?: number;
      respondedBy?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.originCampId !== undefined) repoFilters.originCampId = filters.originCampId;
    if (filters?.destinationCampId !== undefined)
      repoFilters.destinationCampId = filters.destinationCampId;
    if (filters?.involvedCampId !== undefined) repoFilters.involvedCampId = filters.involvedCampId;
    if (filters?.status !== undefined) repoFilters.status = filters.status;
    if (filters?.createdBy !== undefined) repoFilters.createdBy = filters.createdBy;
    if (filters?.respondedBy !== undefined) repoFilters.respondedBy = filters.respondedBy;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateRequest(
    id: number,
    data: UpdateIntercampRequestDTO,
  ): Promise<IntercampRequest | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const originCampId = data.originCampId ?? existing.originCampId;
    const destinationCampId = data.destinationCampId ?? existing.destinationCampId;
    const createdBy = data.createdBy ?? existing.createdBy;
    const respondedBy = data.respondedBy !== undefined ? data.respondedBy : existing.respondedBy;

    await this.validateRoutingAndOwnership(originCampId, destinationCampId, createdBy, respondedBy);

    const updated = await this.repository.update(id, data);
    if (!updated) {
      return null;
    }

    const statusChanged = updated.status !== existing.status;
    if (statusChanged) {
      if (updated.status === 'APPROVED') {
        await this.applyApprovedRequestInventory(updated);
      }

      const notificationType =
        updated.status === 'APPROVED'
          ? 'INTERCAMP_REQUEST_APPROVED'
          : updated.status === 'REJECTED'
            ? 'INTERCAMP_REQUEST_REJECTED'
            : updated.status === 'CANCELED'
              ? 'INTERCAMP_REQUEST_CANCELED'
              : 'INTERCAMP_REQUEST_RECEIVED';

      const title =
        updated.status === 'APPROVED'
          ? 'Solicitud intercampamento aprobada'
          : updated.status === 'REJECTED'
            ? 'Solicitud intercampamento rechazada'
            : updated.status === 'CANCELED'
              ? 'Solicitud intercampamento cancelada'
              : 'Solicitud intercampamento actualizada';

      const message = `La solicitud intercampamento #${updated.id} cambio su estado a ${updated.status}.`;

      await this.notificationService.notifyCampRoles(
        updated.originCampId,
        ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
        {
          type: notificationType,
          title,
          message,
          sourceType: 'intercamp_request',
          sourceId: updated.id,
        },
      );
      await this.notificationService.notifyCampRoles(
        updated.destinationCampId,
        ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
        {
          type: notificationType,
          title,
          message,
          sourceType: 'intercamp_request',
          sourceId: updated.id,
        },
      );
    }

    return updated;
  }

  async deleteRequest(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    const title = 'Solicitud intercampamento eliminada';
    const message = `La solicitud intercampamento #${id} fue eliminada del sistema.`;

    await this.notificationService.notifyCampRoles(
      existing.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'INTERCAMP_REQUEST_CANCELED',
        title,
        message,
        sourceType: 'intercamp_request',
        sourceId: id,
      },
    );

    await this.notificationService.notifyCampRoles(
      existing.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'INTERCAMP_REQUEST_CANCELED',
        title,
        message,
        sourceType: 'intercamp_request',
        sourceId: id,
      },
    );

    return true;
  }
}
