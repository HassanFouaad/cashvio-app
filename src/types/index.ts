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

/**
 * One section of a legal document (privacy policy, terms & conditions).
 * `content` may contain multiple paragraphs separated by "\n\n";
 * `items` renders as a bullet list after the content paragraphs;
 * `footer` renders as a closing paragraph after the bullet list.
 */
export interface LegalSection {
  title: string;
  content: string;
  items?: string[];
  footer?: string;
}

