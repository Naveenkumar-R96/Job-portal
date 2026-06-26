export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const timeAgo = (dateStr) => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  return `${diffMonths}mo ago`;
};

export const formatSalary = (amount, type = '/month') => {
  if (!amount) return 'Not disclosed';
  const formatted = Number(amount).toLocaleString('en-IN');
  return `₹${formatted}${type}`;
};

export const truncate = (str, len = 100) => {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
};

export const JOB_CATEGORIES = [
  'Technology',
  'Design',
  'Marketing',
  'Finance',
  'Healthcare',
  'Education',
  'Engineering',
  'Sales',
  'Human Resources',
  'Operations',
];

export const JOB_TYPES = [
  'Full-Time',
  'Part-Time',
  'Internship',
  'Contract',
  'Remote',
  'Hybrid',
];

export const EXPERIENCE_LEVELS = [
  'Fresher',
  '0-1 years',
  '1-3 years',
  '3-5 years',
  '5-10 years',
  '10+ years',
];
