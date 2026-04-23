import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';

import { EmailOutboxEntity } from './emailOutbox.entity';
import type { EmailOutbox, EnqueueEmailDTO } from './emailOutbox.model';

@Injectable()
export class EmailOutboxRepository {
  constructor(
    @InjectRepository(EmailOutboxEntity)
    private readonly repo: Repository<EmailOutboxEntity>,
  ) {}

  async createPendingEntry(entry: EnqueueEmailDTO, maxAttempts: number): Promise<EmailOutbox> {
    const entity = this.repo.create({
      toEmail: entry.toEmail,
      subject: entry.subject,
      templateKey: entry.templateKey,
      payload: entry.payload ?? {},
      status: 'PENDING',
      attempts: 0,
      maxAttempts,
      nextAttemptAt: new Date(),
      lastError: null,
      sentAt: null,
    });

    return await this.repo.save(entity);
  }

  async findDueForDelivery(limit: number, now: Date): Promise<EmailOutboxEntity[]> {
    return await this.repo.find({
      where: {
        status: In(['PENDING', 'PROCESSING']),
        nextAttemptAt: LessThanOrEqual(now),
      },
      order: {
        nextAttemptAt: 'ASC',
        id: 'ASC',
      },
      take: limit,
    });
  }

  async save(entity: EmailOutboxEntity): Promise<EmailOutboxEntity> {
    return await this.repo.save(entity);
  }
}
