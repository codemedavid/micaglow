import { parsePhoneNumber, CountryCode } from 'libphonenumber-js'

/**
 * Format a phone number to E.164 format (+639...)
 */
export function formatPhoneToE164(phone: string, countryCode: CountryCode = 'PH'): string | null {
  try {
    const phoneNumber = parsePhoneNumber(phone, countryCode)
    if (phoneNumber && phoneNumber.isValid()) {
      return phoneNumber.number
    }
    return null
  } catch {
    return null
  }
}

/**
 * Format a phone number for display
 */
export function formatPhoneDisplay(phone: string): string {
  try {
    const phoneNumber = parsePhoneNumber(phone)
    if (phoneNumber) {
      return phoneNumber.formatInternational()
    }
    return phone
  } catch {
    return phone
  }
}

/**
 * Format currency to PHP
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date to Asia/Manila timezone
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format date to short format
 */
export function formatDateShort(date: string | Date): string {
  const d = new Date(date)
  return new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(d)
}

