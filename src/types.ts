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

export interface SwotFactor {
  id: string;
  text: string;
  type: 'fortaleza' | 'debilidad' | 'oportunidad' | 'amenaza';
  weight: number; // weight sum should be <= 1 for EFI/EFE
  rating: number; // 1 to 4 for EFI/EFE
  area: 'Marketing' | 'Finanzas' | 'Operaciones' | 'Talento Humano' | 'Tecnología' | 'Otros';
}

export interface SwotStrategy {
  id: string;
  type: 'FO' | 'FA' | 'DO' | 'DA';
  title: string;
  description: string;
}

export interface PeyeaFactor {
  id: string;
  dimension: 'FF' | 'VC' | 'FI' | 'EE'; // FF: Fuerza Financiera, VC: Ventaja Competitiva, FI: Fuerza Industria, EE: Estabilidad Entorno
  name: string;
  score: number; // 1 to 6 for FF/FI, -6 to -1 (or 1 to 6 mapped to -6 to -1) for VC/EE
}

export interface MckinseyUnit {
  id: string;
  name: string;
  industryAttractiveness: number; // 1 to 5
  competitiveStrength: number; // 1 to 5
  marketShare: number; // 0 to 100 (determines bubble size)
}

export interface CompetitivenessUnit {
  id: string;
  name: string;
  marketAttractiveness: number; // 1 to 5
  businessCompetitiveness: number; // 1 to 5
}

export interface GrandStrategyState {
  competitivePosition: 'fuerte' | 'debil';
  marketGrowth: 'rapido' | 'lento';
  customQuadrantId?: number;
}

export interface StrategicAnalysisState {
  swotFactors: SwotFactor[];
  swotStrategies: SwotStrategy[];
  peyeaFactors: PeyeaFactor[];
  mckinseyUnits: MckinseyUnit[];
  competitivenessUnits: CompetitivenessUnit[];
  grandStrategy: GrandStrategyState;
  lastUpdated: string;
  history: { date: string; score: number }[];
  ieAnalysisText?: string;
  ieStrategyText?: string;
}

export interface MarketingPlanState {
  generalObjective: GeneralObjective;
  specificObjectives: SpecificObjective[];
  activities: Activity[];
  kpis: KPI[];
  budgetTotalAnnual: number;
  alerts: Alert[];
  strategicAnalysis?: StrategicAnalysisState;
}

