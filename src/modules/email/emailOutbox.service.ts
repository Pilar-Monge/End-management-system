import { Injectable } from '@nestjs/common';

import type { EmailOutbox, EnqueueEmailDTO } from './emailOutbox.model';
import { EmailOutboxEntity } from './emailOutbox.entity';
import { EmailOutboxRepository } from './emailOutbox.repository';

@Injectable()
export class EmailOutboxService {
  constructor(private readonly outboxRepository: EmailOutboxRepository) {}

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
    return await this.outboxRepository.createPendingEntry(
      entry,
      this.resolveMaxAttempts(entry.maxAttempts),
    );
  }

  async enqueueMany(entries: EnqueueEmailDTO[]): Promise<void> {
    for (const entry of entries) {
      await this.enqueue(entry);
    }
  }

  async findDueForDelivery(limit: number, now: Date): Promise<EmailOutboxEntity[]> {
    return await this.outboxRepository.findDueForDelivery(limit, now);
  }

  async save(entity: EmailOutboxEntity): Promise<EmailOutboxEntity> {
    return await this.outboxRepository.save(entity);
  }
}
