import React from 'react';
import { Box, Group, Text, Stack, Avatar } from '@mantine/core';

interface OrganizerCardProps {
  organizerName: string;
  organizerImage: string;
  organizerDescription: string;
}

export const OrganizerCard: React.FC<OrganizerCardProps> = ({
  organizerName,
  organizerImage,
  organizerDescription,
}) => {
  return (
    <Box mt="xl">
      <Group align="flex-start" style={{ width: '100%' }} wrap="nowrap">
        <Box style={{ width: '120px', flexShrink: 0 }}>
          <Avatar 
            src={organizerImage} 
            alt={organizerName}
            size={100}
            radius="md"
            style={{ 
              border: '2px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>
        <Stack gap="sm" style={{ flexGrow: 1 }}>
          <Text 
            fw={700} 
            fz="xl" 
            c="black" 
            style={{ 
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              letterSpacing: '0.01em'
            }}
          >
            {organizerName}
          </Text>
          <Text 
            fz="md" 
            c="black" 
            style={{ lineHeight: 1.6 }}
          >
            {organizerDescription}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
};


