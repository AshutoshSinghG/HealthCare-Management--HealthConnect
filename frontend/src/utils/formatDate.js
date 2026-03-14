import { format, formatDistance, parseISO, isValid } from 'date-fns';

export const formatDate = (date, pattern = 'MMM dd, yyyy') => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, pattern) : '—';
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy · hh:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'hh:mm a');
};

export const formatRelative = (date) => {
  if (!date) return '—';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? formatDistance(parsed, new Date(), { addSuffix: true }) : '—';
};

export const formatShortDate = (date) => {
  return formatDate(date, 'dd/MM/yyyy');
};

export const toISODate = (date) => {
  if (!date) return '';
  const parsed = typeof date === 'string' ? parseISO(date) : date;
  return isValid(parsed) ? format(parsed, 'yyyy-MM-dd') : '';
};
