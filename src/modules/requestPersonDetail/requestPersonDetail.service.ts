import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { assertEntityExists } from '../../common/validation/assert-exists';
import { IntercampRequestEntity } from '../intercampRequest/intercampRequest.entity';
import { NotificationService } from '../notification/notification.service';
import { OccupationEntity } from '../occupation/occupation.entity';
import { PersonEntity } from '../person/person.entity';

import { RequestPersonDetailRepository } from './requestPersonDetail.repository';
import type {
  CreateRequestPersonDetailDTO,
  PersonDetailStatus,
  PersonDetailType,
  RequestPersonDetail,
  UpdateRequestPersonDetailDTO,
} from './requestPersonDetail.model';

@Injectable()
export class RequestPersonDetailService {
  constructor(
    private readonly repository: RequestPersonDetailRepository,
    private readonly notificationService: NotificationService,
    private readonly dataSource: DataSource,
  ) {}

  private async resolveRequestScope(requestId: number): Promise<{
    originCampId: number;
    destinationCampId: number;
  }> {
    const scope = await this.repository.resolveRequestScope(requestId);
    if (!scope) {
      throw new Error('Solicitud intercampamento no encontrada');
    }

    return scope;
  }

  private async notifyRequestPersonChange(
    detail: RequestPersonDetail,
    actionLabel: string,
  ): Promise<void> {
    const scope = await this.resolveRequestScope(detail.requestId);
    const title = 'Detalles de personas intercampamento';
    const personLabel = detail.personId ?? detail.occupationId ?? 0;
    const message = `${actionLabel}: detalle ${detail.id} (${detail.detailType}) sobre referencia ${personLabel}.`;

    await this.notificationService.notifyCampRoles(
      scope.originCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'REQUEST_PERSON_DETAIL_UPDATED',
        title,
        message,
        sourceType: 'request_person_detail',
        sourceId: detail.id,
      },
    );
    await this.notificationService.notifyCampRoles(
      scope.destinationCampId,
      ['SYSTEM_ADMIN', 'RESOURCE_MANAGEMENT', 'TRAVEL_MANAGER'],
      {
        type: 'REQUEST_PERSON_DETAIL_UPDATED',
        title,
        message,
        sourceType: 'request_person_detail',
        sourceId: detail.id,
      },
    );
  }

  async createDetail(data: CreateRequestPersonDetailDTO): Promise<RequestPersonDetail> {
    await assertEntityExists(
      this.dataSource,
      IntercampRequestEntity,
      data.requestId,
      'Intercamp request',
    );

    if (data.personId !== undefined && data.personId !== null) {
      await assertEntityExists(this.dataSource, PersonEntity, data.personId, 'Person');
    }

    if (data.occupationId !== undefined && data.occupationId !== null) {
      await assertEntityExists(this.dataSource, OccupationEntity, data.occupationId, 'Occupation');
    }

    const created = await this.repository.create(data);
    await this.notifyRequestPersonChange(created, 'Se agrego un detalle de persona');
    return created;
  }

  async getDetailById(id: number): Promise<RequestPersonDetail | null> {
    return await this.repository.findById(id);
  }

  async getAllDetails(filters?: {
    requestId?: number;
    detailType?: PersonDetailType;
    status?: PersonDetailStatus;
    personId?: number;
    occupationId?: number;
    page?: number;
    limit?: number;
  }): Promise<{ data: RequestPersonDetail[]; total: number }> {
    const page = filters?.page ?? 1;
    const limit = filters?.limit ?? 10;
    const offset = (page - 1) * limit;

    const repoFilters: {
      requestId?: number;
      detailType?: PersonDetailType;
      status?: PersonDetailStatus;
      personId?: number;
      occupationId?: number;
      offset: number;
      limit: number;
    } = {
      offset,
      limit,
    };

    if (filters?.requestId !== undefined) repoFilters.requestId = filters.requestId;
    if (filters?.detailType !== undefined) repoFilters.detailType = filters.detailType;
    if (filters?.status !== undefined) repoFilters.status = filters.status;
    if (filters?.personId !== undefined) repoFilters.personId = filters.personId;
    if (filters?.occupationId !== undefined) repoFilters.occupationId = filters.occupationId;

    return await this.repository.findAllAndCount(repoFilters);
  }

  async updateDetail(
    id: number,
    data: UpdateRequestPersonDetailDTO,
  ): Promise<RequestPersonDetail | null> {
    if (data.requestId !== undefined) {
      await assertEntityExists(
        this.dataSource,
        IntercampRequestEntity,
        data.requestId,
        'Intercamp request',
      );
    }

    if (data.personId !== undefined && data.personId !== null) {
      await assertEntityExists(this.dataSource, PersonEntity, data.personId, 'Person');
    }

    if (data.occupationId !== undefined && data.occupationId !== null) {
      await assertEntityExists(this.dataSource, OccupationEntity, data.occupationId, 'Occupation');
    }
    const updated = await this.repository.update(id, data);
    if (updated) {
      await this.notifyRequestPersonChange(updated, 'Se actualizo un detalle de persona');
    }

    return updated;
  }

  async deleteDetail(id: number): Promise<boolean> {
    const existing = await this.repository.findById(id);
    if (!existing) {
      return false;
    }

    const deleted = await this.repository.delete(id);
    if (!deleted) {
      return false;
    }

    await this.notifyRequestPersonChange(existing, 'Se elimino un detalle de persona');
    return true;
  }
}
