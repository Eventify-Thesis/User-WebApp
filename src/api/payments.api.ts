import {
  PaymentMethod,
  PaymentIntent,
  PaymentResult,
  PaymentIntentStatus,
} from '../types/payment';

// Environment detection
const isDevelopment = process.env.NODE_ENV === 'development';

// API endpoints configuration
const API_ENDPOINTS = {
  development: {
    base: 'http://localhost:3000',
    momo: 'https://test-payment.momo.vn/v2/gateway/api',
    zalopay: 'https://sb-openapi.zalopay.vn/v2/create',
    payoo: 'https://sbgateway.payoo.vn/v2', // Note: This might need to be updated with actual sandbox URL
    stripe: 'https://api.stripe.com/v1',
  },
  production: {
    base: import.meta.env.VITE_API_URL || 'https://api.your-domain.com',
    momo: 'https://payment.momo.vn/v2/gateway/api',
    zalopay: 'https://openapi.zalopay.vn/v2/create',
    payoo: 'https://gateway.payoo.vn/v2', // Note: This might need to be updated with actual production URL
    stripe: 'https://api.stripe.com/v1',
  },
};

const getCurrentEndpoints = () => {
  return isDevelopment ? API_ENDPOINTS.development : API_ENDPOINTS.production;
};

// Test configuration for sandbox environments
const SANDBOX_CONFIG = {
  momo: {
    partnerCode: 'MOMONPMB20210629',
    accessKey: 'Q2XhhSdgpKUlQ4Ky',
    secretKey: 'k6B53GQKSjktZGJBK2MyrDa7w9S6RyCf',
    testAccounts: [
      { phone: '0938023111', otp: '000000', password: '000000' },
      { phone: '0938023112', otp: '000000', password: '000000' },
      { phone: '0938023113', otp: '000000', password: '111111' },
    ],
  },
  zalopay: {
    appId: '2553', // This is a demo app ID from ZaloPay documentation
    key1: 'sdngKKJmqEMzvh5QQcdD2A9XBSKUNaYn',
    key2: 'trMrHtvjo6myautxDUiAcYsVtaeQ8nhf',
    testVerificationCode: '111111',
  },
  payoo: {
    // These would need to be obtained from Payoo directly
    merchantId: 'DEMO_MERCHANT',
    secretKey: 'DEMO_SECRET',
    note: 'Contact Payoo for sandbox credentials',
  },
};

export const getAvailablePaymentMethods = async (): Promise<
  PaymentMethod[]
> => {
  // Mock implementation - replace with actual API calls
  const endpoints = getCurrentEndpoints();

  console.log(
    'Environment:',
    isDevelopment ? 'Development (Sandbox)' : 'Production',
  );
  console.log('Using endpoints:', endpoints);

  if (isDevelopment) {
    console.log('Sandbox configurations available:', SANDBOX_CONFIG);
  }

  return [
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay with your credit or debit card',
      type: 'stripe',
      enabled: true,
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Pay with ZaloPay e-wallet',
      type: 'zalopay',
      enabled: true,
    },
    {
      id: 'momo',
      name: 'MoMo',
      description: 'Pay with MoMo e-wallet',
      type: 'momo',
      enabled: true,
    },
    {
      id: 'payoo',
      name: 'Payoo',
      description: 'Pay via bank transfer or POS',
      type: 'payoo',
      enabled: isDevelopment ? false : true, // Disable in dev until sandbox is available
    },
  ];
};

export const createPaymentIntent = async (
  amount: number,
  currency: string,
  paymentMethodId: string,
  orderId: string,
): Promise<PaymentIntent> => {
  const endpoints = getCurrentEndpoints();

  // Mock QR code data for different providers (in real implementation, this would come from the provider APIs)
  const generateMockQRCode = (methodId: string) => {
    const baseQRData = `00020101021226520010vn.${methodId}`;
    const amountData = `5405${amount.toString().padStart(5, '0')}`;
    const currencyData = `5303704`; // VND currency code
    const checksumData = `6304ABCD`; // Mock checksum
    return `${baseQRData}${amountData}${currencyData}${checksumData}`;
  };

  // Mock implementation for different providers
  const mockPaymentIntent: PaymentIntent = {
    id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    amount,
    currency,
    status: PaymentIntentStatus.PENDING,
    clientSecret: `pi_${Date.now()}_secret_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    // Add QR code for Vietnamese payment methods
    qrCode: ['zalopay', 'momo', 'payoo'].includes(paymentMethodId)
      ? generateMockQRCode(paymentMethodId)
      : undefined,
    // Add redirect URL for all methods
    redirectUrl:
      endpoints[paymentMethodId as keyof typeof endpoints] || endpoints.stripe,
    metadata: {
      environment: isDevelopment ? 'sandbox' : 'production',
      paymentMethodId,
      paymentProvider: paymentMethodId, // Store the payment provider for later use
      endpoint:
        endpoints[paymentMethodId as keyof typeof endpoints] ||
        endpoints.stripe,
      // Add timestamp and order info
      createdAt: new Date().toISOString(),
      orderId: orderId,
    },
  };

  if (isDevelopment) {
    // Add sandbox-specific information
    switch (paymentMethodId) {
      case 'momo':
        mockPaymentIntent.metadata = {
          ...mockPaymentIntent.metadata,
          sandboxInfo: {
            ...SANDBOX_CONFIG.momo,
            downloadUrl: 'https://test-payment.momo.vn/download/',
            apiUrl: 'https://test-payment.momo.vn/v2/gateway/api',
          },
          testInstructions: 'Use test accounts provided in sandboxInfo',
        };
        break;
      case 'zalopay':
        mockPaymentIntent.metadata = {
          ...mockPaymentIntent.metadata,
          sandboxInfo: {
            ...SANDBOX_CONFIG.zalopay,
            downloadUrl: 'https://github.com/zalopay-samples/test-wallets',
            apiUrl: 'https://sb-openapi.zalopay.vn/',
          },
          testInstructions:
            'Download ZaloPay test app and use verification code 111111',
        };
        break;
      case 'payoo':
        mockPaymentIntent.metadata = {
          ...mockPaymentIntent.metadata,
          sandboxInfo: {
            ...SANDBOX_CONFIG.payoo,
            contactInfo: 'Contact Payoo business team for sandbox access',
            websiteUrl: 'https://www.payoo.vn/',
          },
          testInstructions: 'Contact Payoo for sandbox access',
        };
        break;
    }
  }

  return mockPaymentIntent;
};

export const confirmPayment = async (
  paymentIntentId: string,
): Promise<PaymentResult> => {
  // In development, use mock implementation
  if (isDevelopment) {
    // Mock implementation for development
    const isSuccess = Math.random() > 0.1; // 90% success rate for testing

    return {
      success: isSuccess,
      paymentIntentId,
      transactionId: `txn_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
      amount: 1000,
      currency: 'VND',
      status: isSuccess
        ? PaymentIntentStatus.SUCCEEDED
        : PaymentIntentStatus.FAILED,
      paidAt: isSuccess ? new Date() : undefined,
      metadata: {
        environment: 'sandbox',
        timestamp: new Date().toISOString(),
      },
      ...(isSuccess
        ? {}
        : { errorMessage: 'Payment failed. Please try again.' }),
    };
  }

  // In production, call real backend endpoint
  try {
    const response = await fetch(
      `${getCurrentEndpoints().base}/bookings/confirm-payment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Add auth token
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: data.success,
      paymentIntentId: data.paymentIntentId,
      transactionId: data.transactionId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      paidAt: data.paidAt ? new Date(data.paidAt) : undefined,
      metadata: data.metadata,
      errorMessage: data.errorMessage,
    };
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return {
      success: false,
      paymentIntentId,
      amount: 0,
      currency: 'VND',
      status: PaymentIntentStatus.FAILED,
      errorMessage: 'Payment confirmation failed. Please try again.',
    };
  }
};
