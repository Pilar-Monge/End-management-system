export const DAILY_CONSUMPTION_TYPE_VALUES = ['consumo_racion'] as const;

export type DailyConsumptionType = (typeof DAILY_CONSUMPTION_TYPE_VALUES)[number];

export interface DailyConsumption {
  id: number;
  fecha: Date;
  campamentoId: number;
  recursoId: number;
  cantidad: string;
  tipo: DailyConsumptionType;
}
