import { Injectable } from '@nestjs/common';

export interface ServerTimeResponse {
  serverTime: string;
}

@Injectable()
export class SystemTimeService {
  private offsetMilliseconds: number = 0;

  now(): Date {
    return new Date(Date.now() + this.offsetMilliseconds);
  }

  nowIso(): string {
    return this.now().toISOString();
  }

  getServerTime(): ServerTimeResponse {
    return {
      serverTime: this.nowIso(),
    };
  }

  addOffset(milliseconds: number): { offset: number; newTime: string } {
    this.offsetMilliseconds += milliseconds;
    return {
      offset: this.offsetMilliseconds,
      newTime: this.nowIso(),
    };
  }

  getOffset(): number {
    return this.offsetMilliseconds;
  }

  resetOffset(): void {
    this.offsetMilliseconds = 0;
  }
}
