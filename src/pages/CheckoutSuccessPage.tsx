import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Result, Spin, Button, Typography, Space } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { IconShoppingCartCheck, IconGift, IconDownload, IconFileTypePdf } from '@tabler/icons-react';
import QRCode from 'react-qr-code';
import { bookingClient } from '@/api/booking.client';
import { useGetOrderDetailById } from '@/queries/useGetOrders';
import { Loading } from '@/components/common/Loading/Loading';

const { Text } = Typography;

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface OrderType {
  type: 'free' | 'paid';
  paymentMethod: 'stripe' | 'zalopay' | 'momo' | 'payoo' | 'free';
  paymentMethodName: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
}

const CheckoutSuccessContent: React.FC = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<OrderType>({
    type: 'paid',
    paymentMethod: 'stripe',
    paymentMethodName: 'Stripe',
    status: 'loading',
  });

  const {
    data: orderData,
    isLoading,
  } = useGetOrderDetailById(orderId || '');

  useEffect(() => {
    const clientSecret = searchParams.get('payment_intent_client_secret');
    const paymentIntentStatus = searchParams.get('redirect_status');
    const isFreeOrder = searchParams.get('free') === 'true';
    const paymentMethod = searchParams.get('payment_method') || 'stripe';
    const paymentMethodName =
      searchParams.get('payment_method_name') || 'Stripe';

    // Check if this is a free order
    if (
      isFreeOrder ||
      (!clientSecret && !paymentIntentStatus && !paymentMethod)
    ) {
      setOrderInfo({
        type: 'free',
        paymentMethod: 'free',
        paymentMethodName: 'Free',
        status: 'success',
      });
      return;
    }

    // Handle Vietnamese payment methods
    if (paymentMethod !== 'stripe') {
      // Call completion API for Vietnamese payments
      const handleVietnamesePaymentCompletion = async () => {
        try {
          const paymentIntentId = searchParams.get('payment_intent_id');
          const amount = searchParams.get('amount');
          const transactionId = searchParams.get('transaction_id');

          console.log('Payment completion parameters:', {
            paymentIntentId,
            orderId,
            amount,
            transactionId,
            paymentMethod,
          });

          if (!paymentIntentId || !orderId || !amount) {
            throw new Error(`Missing payment completion parameters: paymentIntentId=${paymentIntentId}, orderId=${orderId}, amount=${amount}`);
          }

          await bookingClient.completeVietnamesePayment({
            orderId: Number(orderId),
            paymentIntentId,
            paymentProvider: paymentMethod,
            amount: Number(amount),
            transactionId: transactionId || undefined,
          });
          

          setOrderInfo({
            type: 'paid',
            paymentMethod: paymentMethod as 'zalopay' | 'momo' | 'payoo',
            paymentMethodName: paymentMethodName,
            status: 'success',
          });
        } catch (error) {
          console.error('Failed to complete Vietnamese payment:', error);
          setOrderInfo({
            type: 'paid',
            paymentMethod: paymentMethod as 'zalopay' | 'momo' | 'payoo',
            paymentMethodName: paymentMethodName,
            status: 'error',
            error: 'Failed to complete payment verification. Please contact support.',
          });
        }
      };

      handleVietnamesePaymentCompletion();
      return;
    }

    // Handle Stripe payment verification
    if (!clientSecret) {
      setOrderInfo({
        type: 'paid',
        paymentMethod: 'stripe',
        paymentMethodName: 'Stripe',
        status: 'error',
        error: 'Payment verification failed. Please contact support.',
      });
      return;
    }

    // Verify payment status from URL parameters
    switch (paymentIntentStatus) {
      case 'succeeded':
        setOrderInfo({
          type: 'paid',
          paymentMethod: 'stripe',
          paymentMethodName: 'Stripe',
          status: 'success',
        });
        break;
      case 'processing':
        setOrderInfo({
          type: 'paid',
          paymentMethod: 'stripe',
          paymentMethodName: 'Stripe',
          status: 'loading',
        });
        break;
      case 'requires_payment_method':
        setOrderInfo({
          type: 'paid',
          paymentMethod: 'stripe',
          paymentMethodName: 'Stripe',
          status: 'error',
          error: 'Payment failed. Please try another payment method.',
        });
        break;
      default:
        setOrderInfo({
          type: 'paid',
          paymentMethod: 'stripe',
          paymentMethodName: 'Stripe',
          status: 'error',
          error: `Unexpected payment status: ${paymentIntentStatus}`,
        });
        break;
    }
  }, [searchParams]);


  if(isLoading) {
    return <Loading/>
  }

  if (orderInfo.status === 'loading') {
    return (
      <Result
        style={{
          color: '#fff',
        }}
        icon={<LoadingOutlined />}
        title="Processing Your Payment"
        subTitle="Please wait while we confirm your payment..."
        extra={
          <Space direction="vertical" align="center">
            <Spin size="large" />
            <Text type="secondary">This may take a few moments</Text>
          </Space>
        }
      />
    );
  }

  if (orderInfo.status === 'error') {
    return (
      <Result
        style={{
          color: '#fff',
        }}
        status="error"
        title="Order Processing Failed"
        subTitle={orderInfo.error || 'An unexpected error occurred'}
        extra={[
          <Button
            key="retry"
            type="primary"
            onClick={() => navigate(`/checkout/${orderId}`)}
          >
            Try Again
          </Button>,
        ]}
      />
    );
  }

  // Success state - different messages for free vs paid orders
  const isFreeOrder = orderInfo.type === 'free';
  const isVietnamesePayment = ['zalopay', 'momo', 'payoo'].includes(
    orderInfo.paymentMethod,
  );

  // Download functions
  const downloadTicketPDF = async () => {
    const publicId = orderData?.publicId || orderId;
    alert(`PDF download for order ${publicId} will be implemented soon!`);
  };

  const downloadTicketImage = async () => {
    if (!orderData) {
      alert('Order data not available. Please try again later.');
      return;
    }

    try {
      const items = orderData.items || [];
      
      if (items.length === 0) {
        alert('No tickets found in this order.');
        return;
      }

      // Generate and download QR code for each ticket item
      items.forEach((item: any, index: number) => {
        // Create QR code value using item's unique identifier
        const qrValue = `${orderData.publicId}-ticket-${item.id || index + 1}`;
        
        // Generate QR code using qrcode library (you may need to install: npm install qrcode)
        // For now, create a simple data URL that can be used as QR value
        import('qrcode').then((QRCodeLib) => {
          QRCodeLib.default.toDataURL(qrValue, {
            width: 300,
            margin: 1,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          }, (err: any, dataURL: string) => {
            if (!err && dataURL) {
              // Convert data URL to blob and download
              fetch(dataURL)
                .then(res => res.blob())
                .then(blob => {
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `qr-${orderData.publicId}-ticket-${item.id || index + 1}.png`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                });
            }
          });
        }).catch(() => {
          // Fallback: create a simple canvas with text if qrcode library is not available
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = 300;
            canvas.height = 300;
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 300, 300);
            ctx.fillStyle = 'black';
            ctx.font = '16px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('QR Code:', 150, 140);
            ctx.fillText(qrValue, 150, 160);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `qr-${orderData.publicId}-ticket-${item.id || index + 1}.png`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }
            });
          }
        });
      });

    } catch (error) {
      console.error('Failed to generate QR codes:', error);
      alert('Failed to generate QR codes. Please try again.');
    }
  };

  return (
    <Result
      style={{
        color: 'white !important',
      }}
      status="success"
      title={
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: '2rem' }}>
          {isFreeOrder ? 'Registration Confirmed!' : 'Payment Successful!'}
        </Text>
      }
      subTitle={
        <Space direction="vertical" align="center" size="large">
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: '1.5rem',
            }}
          >
            {isFreeOrder
              ? `Thank you for registering! Your free tickets for order #${orderId} have been confirmed.`
              : `Thank you for your purchase! Your payment via ${orderInfo.paymentMethodName} for order #${orderId} has been confirmed.`}
          </Text>
          <Text
            style={{
              color: 'white',
            }}
            type="secondary"
          >
            Your e-tickets are now available in the My Tickets section. You can
            download and view them at any time.
          </Text>
          {isFreeOrder && (
            <Text
              style={{
                color: '#52c41a',
                fontWeight: 'bold',
              }}
            >
              🎉 This event was free - no payment required!
            </Text>
          )}
          {isVietnamesePayment && (
            <Text
              style={{
                color: '#52c41a',
                fontWeight: 'bold',
              }}
            >
              ✅ Payment completed via {orderInfo.paymentMethodName}
            </Text>
          )}
        </Space>
      }
      extra={[
        <div key="actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button
            key="tickets"
            type="primary"
            icon={isFreeOrder ? <IconGift /> : <IconShoppingCartCheck />}
            size="large"
            onClick={() => {
              const publicId = orderData?.publicId || orderId;
              navigate(`/orders/${publicId}`);
            }}
          >
            View My Orders
          </Button>
          
          <Button
            key="download-pdf"
            type="default"
            icon={<IconFileTypePdf />}
            size="large"
            onClick={downloadTicketPDF}
            style={{ 
              backgroundColor: '#ff4d4f', 
              borderColor: '#ff4d4f', 
              color: 'white',
            }}
          >
            Download PDF
          </Button>

          <Button
            key="download-image"
            type="default"
            icon={<IconDownload />}
            size="large"
            onClick={downloadTicketImage}
            style={{ 
              backgroundColor: '#52c41a', 
              borderColor: '#52c41a', 
              color: 'white',
            }}
          >
            Download Image
          </Button>
        </div>
      ]}
    />
  );
};

const CheckoutSuccessPage: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutSuccessContent />
    </Elements>
  );
};

export default CheckoutSuccessPage;
