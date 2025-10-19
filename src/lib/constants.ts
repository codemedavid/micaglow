export const BATCH_STATUS = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  FILLING: 'FILLING',
  LOCKED: 'LOCKED',
  PAYMENT: 'PAYMENT',
  CLOSED: 'CLOSED',
} as const

export const ORDER_STATUS = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  INVALID: 'INVALID',
  CANCELLED: 'CANCELLED',
} as const

export const USER_ROLE = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
} as const

export const BATCH_STATUS_LABELS: Record<keyof typeof BATCH_STATUS, string> = {
  DRAFT: 'Draft',
  OPEN: 'Open',
  FILLING: 'Filling',
  LOCKED: 'Locked',
  PAYMENT: 'Payment',
  CLOSED: 'Closed',
}

export const BATCH_STATUS_COLORS: Record<keyof typeof BATCH_STATUS, string> = {
  DRAFT: 'bg-muted text-muted-foreground',
  OPEN: 'bg-primary text-primary-foreground',
  FILLING: 'bg-secondary text-secondary-foreground',
  LOCKED: 'bg-accent text-accent-foreground',
  PAYMENT: 'bg-primary text-primary-foreground',
  CLOSED: 'bg-muted text-muted-foreground',
}

export const ORDER_STATUS_LABELS: Record<keyof typeof ORDER_STATUS, string> = {
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  INVALID: 'Invalid',
  CANCELLED: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<keyof typeof ORDER_STATUS, string> = {
  PENDING: 'bg-accent text-accent-foreground',
  VERIFIED: 'bg-primary text-primary-foreground',
  INVALID: 'bg-destructive text-destructive-foreground',
  CANCELLED: 'bg-muted text-muted-foreground',
}

