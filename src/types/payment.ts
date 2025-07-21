export interface PaymentMethod {
  id: string;
  name: string;
  type: 'stripe' | 'zalopay' | 'momo' | 'payoo';
  logo?: string;
  description?: string;
  enabled: boolean;
  config?: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  clientSecret?: string;
  redirectUrl?: string;
  qrCode?: string;
  metadata?: Record<string, any>;
}

export enum PaymentIntentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REQUIRES_ACTION = 'requires_action',
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  transactionId?: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  paidAt?: Date;
  errorMessage?: string;
  metadata?: Record<string, any>;
}
