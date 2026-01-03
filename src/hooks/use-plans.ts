'use client';

import { plansService, PublicPlan } from '@/lib/http';
import { useLocale } from 'next-intl';
import * as React from 'react';

interface UsePlansResult {
  plans: PublicPlan[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch public plans from the API
 */
export function usePlans(): UsePlansResult {
  const locale = useLocale();
  const [plans, setPlans] = React.useState<PublicPlan[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchPlans = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await plansService.getAll();
      setPlans(response.items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch plans'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Helper to get localized plan name
  const getLocalizedPlans = React.useMemo(() => {
    return plans.map((plan) => ({
      ...plan,
      name: locale === 'ar' ? plan.arName : plan.enName,
      details: locale === 'ar' ? plan.detailsAr : plan.detailsEn,
    }));
  }, [plans, locale]);

  return {
    plans: getLocalizedPlans,
    isLoading,
    error,
    refetch: fetchPlans,
  };
}

/**
 * Hook to get the freemium plan
 */
export function useFreemiumPlan() {
  const [plan, setPlan] = React.useState<PublicPlan | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const fetchFreemium = async () => {
      try {
        setIsLoading(true);
        const freemiumPlan = await plansService.getFreemium();
        setPlan(freemiumPlan);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch freemium plan')
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreemium();
  }, []);

  return { plan, isLoading, error };
}

