import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TransferPersonService } from '../transferPerson/transferPerson.service';
import { TransferService } from '../transfer/transfer.service';
import { NotificationService } from '../notification/notification.service';
import { IntercampRequestRepository } from './intercampRequest.repository';
import type {
  CreateIntercampRequestDTO,
  IntercampRequest,
  IntercampRequestStatus,
  UpdateIntercampRequestDTO,
} from './intercampRequest.model';

type RequestActorContext = {
  userId: number;
  campId: number;
  rol: string;
};

@Injectable()
export class IntercampRequestService {
  constructor(
    private readonly repository: IntercampRequestRepository,
    private readonly notificationService: NotificationService,
    private readonly transferService: TransferService,
    private readonly transferPersonService: TransferPersonService,
  ) {}

  private resolvePlannedTransferDates(request: IntercampRequest): {
    plannedDepartureDate: Date;
    plannedArrivalDate: Date;
  } {
    if (!request.plannedDepartureDate || !request.plannedArrivalDate) {
      throw new BadRequestException('plannedDepartureDate and plannedArrivalDate are required');
    }

    const plannedDepartureDate = request.plannedDepartureDate;
    const plannedArrivalDate = request.plannedArrivalDate;

    if (plannedDepartureDate.getTime() < Date.now()) {
      throw new BadRequestException(
        'No se puede aprobar una solicitud con la fecha planeada en el pasado',
      );
    }

    // require arrival to be strictly later than departure by at least 1 minute
    const diff = plannedArrivalDate.getTime() - plannedDepartureDate.getTime();
    if (diff <= 60 * 1000) {
      throw new BadRequestException(
        'plannedArrivalDate must be at least 1 minute later than plannedDepartureDate',
      );
    }

    return {
      plannedDepartureDate,
      plannedArrivalDate,
    };
  }

  private hasAutoTransferNeeds(request: IntercampRequest): boolean {
    return request.personRequirements.length > 0;
  }

  private toNumber(value: string | number | null | undefined): number {
    const parsed = Number.parseFloat(String(value ?? '0'));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private async assertResourceAvailability(request: IntercampRequest): Promise<void> {
    const details = await this.repository.findRequestResourceAmountsByRequestId(request.id);

    for (const detail of details) {
      const requestedAmount = this.toNumber(detail.amount);
      if (requestedAmount <= 0) {
        continue;
      }

      const [inventoryRow, committedAmountRaw] = await Promise.all([
        this.repository.findCampInventoryWithMinimum(
          request.destinationCampId,
          detail.resourceTypeId,
        ),
        this.repository.findCommittedTransferAmountByCampAndResourceType(
          request.destinationCampId,
          detail.resourceTypeId,
          request.id,
        ),
      ]);

      const currentAmount = this.toNumber(inventoryRow.current);
      const minimumAmount = this.toNumber(inventoryRow.minimum);
      const committedAmount = this.toNumber(committedAmountRaw);
      const availableAmount = currentAmount - committedAmount;

      if (availableAmount < requestedAmount) {
        throw new BadRequestException(
          `No hay inventario suficiente para aprobar el recurso ${detail.resourceTypeId}`,
        );
      }

      const remainingAfter = currentAmount - committedAmount - requestedAmount;
      if (remainingAfter < minimumAmount) {
        throw new BadRequestException(
          `No se puede aprobar el recurso ${detail.resourceTypeId}: dejaría el inventario por debajo del mínimo requerido (${minimumAmount})`,
        );
      }
    }
  }

  private assertRequestUpdatePolicy(
    existing: IntercampRequest,
    data: UpdateIntercampRequestDTO,
    actor: RequestActorContext,
  ): void {
    const requestedStatus = data.status ?? existing.status;

    if (existing.status === 'REJECTED' || existing.status === 'CANCELED') {
      throw new BadRequestException('La solicitud ya finalizo y no puede cambiarse');
    }

    if (existing.status === 'APPROVED') {
      if (requestedStatus !== 'REJECTED') {
        throw new BadRequestException('La solicitud aprobada no puede volver a editarse');
      }

      if (actor.campId !== existing.destinationCampId) {
        throw new BadRequestException('Solo el campamento destino puede rechazar una solicitud aprobada');
      }

      return;
    }

    if (requestedStatus === 'APPROVED' || requestedStatus === 'REJECTED') {
      if (actor.campId !== existing.destinationCampId) {
        throw new BadRequestException('Solo el campamento destino puede aprobar o rechazar la solicitud');
      }

      return;
    }

    if (requestedStatus === 'CANCELED') {
      if (actor.campId !== existing.originCampId) {
        throw new BadRequestException('Solo el campamento origen puede cancelar la solicitud');
      }

      return;
    }

    if (actor.campId !== existing.originCampId) {
      throw new BadRequestException('Solo el campamento origen puede editar una solicitud pendiente');
    }
  }

  private async cancelTransferIfPresent(requestId: number): Promise<void> {
    const transfer = await this.transferService.getTransferByRequestId(requestId);
    if (!transfer) {
      return;
    }

    if (transfer.status === 'PENDING_DEPARTURE') {
      await this.transferService.updateTransfer(transfer.id, { status: 'CANCELED' });
    }
  }

  private async ensureApprovedRequestTransfer(request: IntercampRequest): Promise<void> {
    this.resolvePlannedTransferDates(request);
    await this.assertResourceAvailability(request);

    const detailRows = await this.repository.findRequestResourceAmountsByRequestId(request.id);
    const needsTransfer = detailRows.length > 0 || this.hasAutoTransferNeeds(request);

    if (!needsTransfer) {
      return;
    }

    let transfer = await this.transferService.getTransferByRequestId(request.id);
    if (!transfer) {
      const plannedDates = this.resolvePlannedTransferDates(request);
      transfer = await this.transferService.createTransfer({
        requestId: request.id,
        plannedDepartureDate: plannedDates.plannedDepartureDate,
        plannedArrivalDate: plannedDates.plannedArrivalDate,
        status: 'PENDING_DEPARTURE',
      });
    }

    if (request.personRequirements.length > 0) {
      await this.transferPersonService.autoAssignGroupForTransfer(
        transfer.id,
        request.destinationCampId,
        request.personRequirements,
      );
    }

    await this.transferService.syncTransferRations(transfer.id);
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

    const [originCamp, destinationCamp] = await Promise.all([
      this.repository.findCampById(created.originCampId),
      this.repository.findCampById(created.destinationCampId),
    ]);

    const originCampName = originCamp?.name ?? 'campamento origen';
    const destinationCampName = destinationCamp?.name ?? 'campamento destino';

    await this.notificationService.notifyUser(created.createdBy, {
      campId: created.originCampId,
      type: 'INTERCAMP_REQUEST_RECEIVED',
      title: 'Solicitud intercampamento creada',
      message: `Tu solicitud intercampamento #${created.id} fue registrada y enviada al campamento ${destinationCampName}.`,
      sourceType: 'intercamp_request',
      sourceId: created.id,
    });

    await this.notificationService.notifyCampRoles(
      created.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'INTERCAMP_REQUEST_RECEIVED',
        title: 'Nueva solicitud intercampamento',
        message: `Se recibio una solicitud intercampamento #${created.id} desde el campamento ${originCampName}.`,
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
    actor: RequestActorContext,
  ): Promise<IntercampRequest | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    this.assertRequestUpdatePolicy(existing, data, actor);

    const originCampId = data.originCampId ?? existing.originCampId;
    const destinationCampId = data.destinationCampId ?? existing.destinationCampId;
    const createdBy = data.createdBy ?? existing.createdBy;
    const persistedData: UpdateIntercampRequestDTO = {
      ...data,
      respondedBy: data.status !== undefined ? actor.userId : data.respondedBy ?? existing.respondedBy,
      responseDate: data.status !== undefined ? new Date() : data.responseDate ?? existing.responseDate,
    };
    const respondedBy =
      persistedData.respondedBy !== undefined ? persistedData.respondedBy : existing.respondedBy;
    const resolvedPersonRequirements = data.personRequirements ?? existing.personRequirements;

    if (data.status === 'APPROVED' && resolvedPersonRequirements.length > 0) {
      await this.transferPersonService.canFulfillRequirements(
        destinationCampId,
        resolvedPersonRequirements,
      );
    }

    if (data.status === 'APPROVED') {
      this.resolvePlannedTransferDates({
        ...existing,
        ...persistedData,
        originCampId,
        destinationCampId,
        createdBy,
        respondedBy,
      });
      await this.assertResourceAvailability({
        ...existing,
        ...persistedData,
        originCampId,
        destinationCampId,
        createdBy,
        respondedBy,
      });
    }

    await this.validateRoutingAndOwnership(originCampId, destinationCampId, createdBy, respondedBy);

    if (data.status === 'APPROVED') {
      if (actor.campId !== destinationCampId) {
        throw new BadRequestException('Solo el campamento destino puede aprobar la solicitud');
      }
    }

    if (data.status === 'CANCELED' && actor.campId !== originCampId) {
      throw new BadRequestException('Solo el campamento origen puede cancelar la solicitud');
    }

    if (data.status === 'REJECTED' || data.status === 'CANCELED') {
      const transfer = await this.transferService.getTransferByRequestId(id);
      if (transfer?.status === 'COMPLETED') {
        throw new BadRequestException(
          'No se puede modificar una solicitud cuyo traslado ya fue completado',
        );
      }
    }

    const updated = await this.repository.update(id, persistedData);
    if (!updated) {
      return null;
    }

    if (data.status === 'REJECTED' || data.status === 'CANCELED') {
      await this.cancelTransferIfPresent(id);
    }

    const statusChanged = updated.status !== existing.status;
    if (statusChanged) {
      if (updated.status === 'APPROVED') {
        await this.ensureApprovedRequestTransfer(updated);
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
