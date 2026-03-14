import type { TransferStatus } from '../transfer/transfer.model';

export interface TransferHistory {
  id: number;
  transferId: number;
  previousStatus: TransferStatus;
  newStatus: TransferStatus;
  date: Date;
  userId: number;
  comment: string | null;
}

export interface CreateTransferHistoryDTO {
  transferId: number;
  previousStatus: TransferStatus;
  newStatus: TransferStatus;
  date?: Date;
  userId: number;
  comment?: string | null;
}

export interface UpdateTransferHistoryDTO {
  transferId?: number;
  previousStatus?: TransferStatus;
  newStatus?: TransferStatus;
  date?: Date;
  userId?: number;
  comment?: string | null;
}
