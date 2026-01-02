export type PlanPeriod = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export interface PlanFeature {
  id: string;
  planId: string;
  featureId: string;
  value: boolean | Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Plan {
  id: string;
  arName: string;
  enName: string;
  price: number;
  period: PlanPeriod;
  isActive: boolean;
  planFeatures: PlanFeature[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

