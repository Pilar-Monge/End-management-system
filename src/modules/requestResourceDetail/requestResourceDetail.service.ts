import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { NotificationService } from '../notification/notification.service';
import { ResourceTypeEntity } from '../resourceType/resourceType.entity';

import { RequestResourceDetailRepository } from './requestResourceDetail.repository';
import type {
  CreateRequestResourceDetailDTO,
  RequestResourceDetail,
  UpdateRequestResourceDetailDTO,
} from './requestResourceDetail.model';

@Injectable()
export class RequestResourceDetailService {
  constructor(
    private readonly repository: RequestResourceDetailRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  }> {
    const requestRepo = this.dataSource.getRepository(IntercampRequestEntity);
    const request = await requestRepo.findOne({
      where: { id: requestId },
      select: {
        originCampId: true,
        destinationCampId: true,
      },
    });

    if (!request) {
      throw new Error('Intercamp request not found');
    }

    return {
      originCampId: request.originCampId,
      destinationCampId: request.destinationCampId,
    };
  }

  private async notifyRequestResourceChange(
    requestId: number,
    detailId: number,
    resourceTypeId: number,
    actionLabel: string,
  ): Promise<void> {
    const scope = await this.resolveRequestScope(requestId);
    const title = 'Detalle de recursos intercampamento';
    const message = `${actionLabel}: detalle ${detailId} para recurso ${resourceTypeId} en solicitud ${requestId}.`;

    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'REQUEST_RESOURCE_DETAIL_UPDATED',
        title,
        message,
        sourceType: 'request_resource_detail',
        sourceId: detailId,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'REQUEST_RESOURCE_DETAIL_UPDATED',
        title,
        message,
        sourceType: 'request_resource_detail',
        sourceId: detailId,
      },
    );
  }

  async createDetail(data: CreateRequestResourceDetailDTO): Promise<RequestResourceDetail> {
    await assertEntityExists(
      this.dataSource,
      IntercampRequestEntity,
      data.requestId,
      'Intercamp request',
    );
    await assertEntityExists(
      this.dataSource,
      ResourceTypeEntity,
      data.resourceTypeId,
      'Resource type',
    );

    const existing = await this.repository.findByRequestAndResourceType(
      data.requestId,
      data.resourceTypeId,
    );
    if (existing) {
      throw new Error('This request resource detail already exists');
    }

    const created = await this.repository.create(data);
    await this.notifyRequestResourceChange(
      created.requestId,
      created.id,
      created.resourceTypeId,
      'Se agrego un detalle de recurso',
    );
    return created;
  }

  async getDetailById(id: number): Promise<RequestResourceDetail | null> {
    return await this.repository.findById(id);
  }

  async getAllDetails(filters?: {
    requestId?: number;
    resourceTypeId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: RequestResourceDetail[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      resourceTypeId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.resourceTypeId !== undefined) repoFilters.resourceTypeId = filters.resourceTypeId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateDetail(
    id: number,
    data: UpdateRequestResourceDetailDTO,
  ): Promise<RequestResourceDetail | null> {
    const existing = await this.repository.findById(id);
    if (!existing) return null;

    const resolvedRequestId = data.requestId ?? existing.requestId;
    const resolvedResourceTypeId = data.resourceTypeId ?? existing.resourceTypeId;

    if (data.requestId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        IntercampRequestEntity,
        resolvedRequestId,
        'Intercamp request',
      );
    }
    if (data.resourceTypeId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        ResourceTypeEntity,
        resolvedResourceTypeId,
        'Resource type',
      );
    }

    if (
      resolvedRequestId !== existing.requestId ||
      resolvedResourceTypeId !== existing.resourceTypeId
    ) {
      const byPair = await this.repository.findByRequestAndResourceType(
        resolvedRequestId,
        resolvedResourceTypeId,
      );
      if (byPair && byPair.id !== id) {
        throw new Error('This request resource detail already exists');
      }
    }

    const updated = await this.repository.update(id, data);
    if (updated) {
      await this.notifyRequestResourceChange(
        updated.requestId,
        updated.id,
        updated.resourceTypeId,
        'Se actualizo un detalle de recurso',
      );
    }

    return updated;
  }

  async deleteDetail(id: number): Promise<boolean> {
    return await this.repository.delete(id);
  }
}
