import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Available currencies for the application
 */
export type Currency = 'NGN' | 'USD' | 'GBP';

/**
 * Currency display settings
 */
export const currencySettings = {
  NGN: {
    locale: 'en-NG',
    symbol: '₦',
    divisor: 1, // NGN is stored directly, not in minor units
    name: 'Nigerian Naira'
  },
  USD: {
    locale: 'en-US',
    symbol: '$',
    divisor: 100, // USD is stored in cents
    name: 'US Dollar'
  },
  GBP: {
    locale: 'en-GB',
    symbol: '£',
    divisor: 100, // GBP is stored in pence
    name: 'British Pound'
  }
};

/**
 * Format a price with the specified currency
 * @param price Price value
 * @param currency Currency code (NGN, USD, GBP)
 * @returns Formatted price string (e.g. ₦10,000, $10.99, £8.50)
 */
export function formatPrice(price: number, currency: Currency = 'NGN'): string {
  const settings = currencySettings[currency];
  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'NGN' ? 0 : 2,
    maximumFractionDigits: currency === 'NGN' ? 0 : 2,
  }).format(price / settings.divisor);
}
