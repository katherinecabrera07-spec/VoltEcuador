export type Priority = 'Alta' | 'Media' | 'Baja';

export type PlanStatus = 'No iniciado' | 'En progreso' | 'Completado' | 'Retrasado';

export interface GeneralObjective {
  id: string;
  name: string;
  description: string;
  strategy: string;
  responsible: string;
  startDate: string;
  endDate: string;
  status: PlanStatus;
}

export interface SpecificObjective {
  id: string;
  name: string;
  strategicReason: string;
  responsible: string;
  priority: Priority;
  startDate: string;
  endDate: string;
  status: PlanStatus;
  progress: number; // calculated or manual
}

export interface Activity {
  id: string;
  specificObjectiveId: string;
  name: string;
  description: string;
  responsible: string;
  startDate: string;
  endDate: string;
  status: PlanStatus;
  priority: Priority;
  budgetAssigned: number;
  budgetUsed: number;
  progress: number;
  attachments: { name: string; url: string; size: string }[];
}

export interface KPI {
  id: string;
  name: string;
  description: string;
  formula: string;
  unit: string;
  target: number;
  currentValue: number;
  history: { period: string; value: number }[];
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'danger' | 'success';
  date: string;
  read: boolean;
  category: 'vencimiento' | 'presupuesto' | 'retraso' | 'general';
}

export interface MarketingPlanState {
  generalObjective: GeneralObjective;
  specificObjectives: SpecificObjective[];
  activities: Activity[];
  kpis: KPI[];
  budgetTotalAnnual: number;
  alerts: Alert[];
}
