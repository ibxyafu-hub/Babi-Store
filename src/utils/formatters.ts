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
