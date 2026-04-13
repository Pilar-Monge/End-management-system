import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';

import type { EmailOutbox, EnqueueEmailDTO } from './emailOutbox.model';
import { EmailOutboxEntity } from './emailOutbox.entity';

@Injectable()
export class EmailOutboxService {
  constructor(
    @InjectRepository(EmailOutboxEntity)
    private readonly outboxRepo: Repository<EmailOutboxEntity>,
  ) {}

  private resolveMaxAttempts(explicitValue?: number): number {
    if (explicitValue !== undefined && Number.isInteger(explicitValue) && explicitValue > 0) {
      return explicitValue;
    }

    const envValue = Number.parseInt(process.env.EMAIL_MAX_ATTEMPTS ?? '5', 10);
    if (Number.isInteger(envValue) && envValue > 0) {
      return envValue;
    }

    return 5;
  }

  async enqueue(entry: EnqueueEmailDTO): Promise<EmailOutbox> {
    const entity = this.outboxRepo.create({
      toEmail: entry.toEmail,
      subject: entry.subject,
      templateKey: entry.templateKey,
      payload: entry.payload ?? {},
      status: 'PENDING',
      attempts: 0,
      maxAttempts: this.resolveMaxAttempts(entry.maxAttempts),
      nextAttemptAt: new Date(),
      lastError: null,
      sentAt: null,
    });

    return await this.outboxRepo.save(entity);
  }

  async enqueueMany(entries: EnqueueEmailDTO[]): Promise<void> {
    for (const entry of entries) {
      await this.enqueue(entry);
    }
  }

  async findDueForDelivery(limit: number, now: Date): Promise<EmailOutboxEntity[]> {
    return await this.outboxRepo.find({
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
    return await this.outboxRepo.save(entity);
  }
}
