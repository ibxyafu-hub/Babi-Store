/**
 * Utility functions for currency and price formatting
 */

export function formatPrice(amount: number, currency: string = 'BIRR'): string {
  if (isNaN(amount)) return `0 ${currency}`;
  return `${amount.toLocaleString('en-US')} ${currency}`;
}

export function formatNumber(val: number): string {
  return val.toLocaleString('en-US');
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    return `${Math.floor(diffSec / 86400)}d ago`;
  } catch {
    return dateString;
  }
}
