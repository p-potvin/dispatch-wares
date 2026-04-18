import { formatDistanceToNow, format, parseISO } from 'date-fns';

export function formatTime(isoString) {
  if (!isoString) return '';
  try {
    return format(parseISO(isoString), 'HH:mm');
  } catch {
    return '';
  }
}

export function formatRelative(isoString) {
  if (!isoString) return '';
  try {
    return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
  } catch {
    return '';
  }
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str, len = 30) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '\u2026' : str;
}

export function formatWeight(kg) {
  if (kg == null) return '';
  return kg >= 1000 ? `${(kg / 1000).toFixed(1)}t` : `${kg}kg`;
}
