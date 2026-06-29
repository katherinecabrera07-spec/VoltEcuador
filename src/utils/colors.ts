import { KPI } from '../types';

/**
 * Helper to get the correct Tailwind CSS classes and Hex colors based on a progress percentage:
 * - >= 90%: Green (verde)
 * - 70% to 89% (>= 70% and < 90%): Yellow (amarillo)
 * - < 70%: Red (rojo)
 */
export function getProgressColor(progress: number) {
  if (progress >= 90) {
    return {
      text: 'text-emerald-600',
      textHover: 'hover:text-emerald-700',
      bg: 'bg-emerald-600',
      bgHover: 'hover:bg-emerald-700',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      hex: '#10b981', // Green / emerald-500
    };
  } else if (progress >= 70) {
    return {
      text: 'text-amber-500',
      textHover: 'hover:text-amber-600',
      bg: 'bg-amber-500',
      bgHover: 'hover:bg-amber-600',
      bgLight: 'bg-amber-50',
      border: 'border-amber-200',
      badge: 'bg-amber-50 text-amber-700 border-amber-100',
      hex: '#f59e0b', // Yellow / amber-500
    };
  } else {
    return {
      text: 'text-rose-600',
      textHover: 'hover:text-rose-700',
      bg: 'bg-rose-600',
      bgHover: 'hover:bg-rose-700',
      bgLight: 'bg-rose-50',
      border: 'border-rose-200',
      badge: 'bg-rose-50 text-rose-700 border-rose-100',
      hex: '#f43f5e', // Red / rose-500
    };
  }
}

/**
 * Calculates the compliance percentage for a KPI, taking into account
 * whether the metric is a "lower is better" metric (e.g., CAC, Costs, Inventory Rotation)
 */
export function getCompliancePercent(kpi: KPI): number {
  if (kpi.target === 0) return 0;
  
  const nameUpper = kpi.name.toUpperCase();
  const isLowerBetter = nameUpper.includes('CAC') || 
                        nameUpper.includes('COST') || 
                        nameUpper.includes('ROTAC') || 
                        nameUpper.includes('ROTACIÓN');

  if (isLowerBetter) {
    const diff = kpi.currentValue - kpi.target;
    if (diff <= 0) return 100; // On or below target is 100% compliance
    const penalty = (diff / kpi.target) * 100;
    return Math.max(0, Math.round(100 - penalty));
  }

  return Math.round((kpi.currentValue / kpi.target) * 100);
}

