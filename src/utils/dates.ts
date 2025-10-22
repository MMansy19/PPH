import { format, parseISO } from 'date-fns';
import { CATEGORY_COLORS } from '@/lib/utils';

export function formatDate(date: string) {
  try {
    return format(parseISO(date), 'MMM dd, yyyy');
  } catch (error) {
    return format(new Date(date), 'MMM dd, yyyy');
  }
}

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6b7280';
}
