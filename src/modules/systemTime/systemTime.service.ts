import { Injectable } from '@nestjs/common';

export interface ServerTimeResponse {
  serverTime: string;
}
@Injectable()
export class SystemTimeService {
  now(): Date {
    return new Date();
  }
  nowIso(): string {
    return this.now().toISOString();
  }
  getServerTime(): ServerTimeResponse {
    return {
      serverTime: this.nowIso(),
    };
  }
}
