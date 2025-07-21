import React, { useState, useEffect } from 'react';
import {
  Radio,
  Card,
  Stack,
  Text,
  Title,
  Badge,
  Group,
  Box,
  ThemeIcon,
} from '@mantine/core';
import {
  IconCreditCard,
  IconWallet,
  IconBuildingBank,
  IconDeviceMobile,
} from '@tabler/icons-react';
import { PaymentMethod } from '../../../types/payment';

interface PaymentMethodSelectorProps {
  availableMethods: PaymentMethod[];
  selectedMethod: string;
  onMethodChange: (methodId: string) => void;
  disabled?: boolean;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  availableMethods,
  selectedMethod,
  onMethodChange,
  disabled = false,
}) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Filter enabled methods and sort by priority
    const enabledMethods = availableMethods.filter((method) => method.enabled);
    const sortedMethods = enabledMethods.sort((a, b) => {
      // Priority order: Stripe, ZaloPay, MoMo, Payoo
      const priority: Record<string, number> = {
        stripe: 1,
        zalopay: 2,
        momo: 3,
        payoo: 4,
      };
      return (priority[a.type] || 5) - (priority[b.type] || 5);
    });
    setMethods(sortedMethods);
  }, [availableMethods]);

  const getMethodIcon = (method: PaymentMethod) => {
    switch (method.type) {
      case 'stripe':
        return <IconCreditCard size={24} />;
      case 'zalopay':
        return <IconWallet size={24} />;
      case 'momo':
        return <IconDeviceMobile size={24} />;
      case 'payoo':
        return <IconBuildingBank size={24} />;
      default:
        return <IconCreditCard size={24} />;
    }
  };

  const getMethodIconColor = (method: PaymentMethod) => {
    switch (method.type) {
      case 'stripe':
        return 'blue';
      case 'zalopay':
        return 'green';
      case 'momo':
        return 'violet';
      case 'payoo':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getMethodBadge = (method: PaymentMethod) => {
    switch (method.type) {
      case 'stripe':
        return (
          <Badge color="blue" variant="light">
            International
          </Badge>
        );
      case 'zalopay':
        return (
          <Badge color="green" variant="light">
            E-wallet
          </Badge>
        );
      case 'momo':
        return (
          <Badge color="violet" variant="light">
            E-wallet
          </Badge>
        );
      case 'payoo':
        return (
          <Badge color="orange" variant="light">
            Bank Transfer
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Box className="payment-method-selector">
      <Title order={4} mb="xs">
        Select Payment Method
      </Title>
      <Text size="sm" c="dimmed" mb="md">
        Choose your preferred payment method
      </Text>

      <Radio.Group value={selectedMethod} onChange={onMethodChange}>
        <Stack gap="xs">
          {methods.map((method) => (
            <Card
              key={method.id}
              withBorder
              padding="md"
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                borderColor:
                  selectedMethod === method.id
                    ? 'var(--mantine-color-blue-6)'
                    : undefined,
                borderWidth: selectedMethod === method.id ? 2 : 1,
              }}
              onClick={() => !disabled && onMethodChange(method.id)}
            >
              <Radio
                value={method.id}
                disabled={disabled}
                label={
                  <Group gap="md" w="100%">
                    <ThemeIcon
                      variant="light"
                      color={getMethodIconColor(method)}
                      size={40}
                    >
                      {getMethodIcon(method)}
                    </ThemeIcon>
                    <Box flex={1}>
                      <Group justify="space-between" align="center">
                        <Box>
                          <Text fw={500}>{method.name}</Text>
                          <Text size="xs" c="dimmed">
                            {method.description}
                          </Text>
                        </Box>
                        {getMethodBadge(method)}
                      </Group>
                    </Box>
                  </Group>
                }
              />
            </Card>
          ))}
        </Stack>
      </Radio.Group>
    </Box>
  );
};
