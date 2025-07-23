import {
  TextInput,
  Select,
  MultiSelect,
  Group,
  Stack,
  Button,
  Box,
  Text,
  Badge,
  ActionIcon,
  Divider,
  Chip,
  Card,
  Transition,
  Flex,
  Modal,
  UnstyledButton,
} from '@mantine/core';
import {
  IconSearch,
  IconCalendar,
  IconX,
  IconRefresh,
  IconChevronDown,
  IconAdjustments,
  IconSparkles,
  IconMapPin,
  IconFilter,
} from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';

export interface FilterData {
  locationValue: string;
  locationDisplay: string;
  categories: string[];
}

type SetStateAction<S> = S | ((prevState: S) => S);

interface ModernEventFiltersProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  filterData: FilterData;
  setFilterData: (data: SetStateAction<FilterData>) => void;
}

const categoryOptions = [
  { value: 'music', label: 'Music', color: 'pink', icon: '🎵' },
  { value: 'art', label: 'Arts', color: 'violet', icon: '🎭' },
  { value: 'sport', label: 'Sports', color: 'red', icon: '⚽' },
  { value: 'tech', label: 'Tech', color: 'blue', icon: '💻' },
  { value: 'workshop', label: 'Workshop', color: 'indigo', icon: '🛠️' },
  { value: 'food', label: 'Food', color: 'orange', icon: '🍕' },
  { value: 'business', label: 'Business', color: 'teal', icon: '💼' },
  { value: 'networking', label: 'Network', color: 'lime', icon: '🤝' },
  { value: 'entertainment', label: 'Fun', color: 'grape', icon: '🎪' },
  { value: 'education', label: 'Learn', color: 'cyan', icon: '📚' },
  { value: '', label: 'Other', color: 'gray', icon: '🔮' },
];

const locationOptions = [
  { value: '', label: 'All Cities' },
  { value: 'ho chi minh', label: 'HCMC' },
  { value: 'hanoi', label: 'Ha Noi' },
  { value: 'da nang', label: 'Da Nang' },
  { value: 'hue', label: 'Hue' },
  { value: 'da lat', label: 'Da Lat' },
  { value: 'nha trang', label: 'Nha Trang' },
];

const datePresets = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-weekend', label: 'Weekend' },
];

export const ModernEventFilters = ({
  selectedDates,
  setSelectedDates,
  filterData,
  setFilterData,
}: ModernEventFiltersProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDatePreset, setActiveDatePreset] = useState<string | null>(null);

  // Initialize search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('query') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const params = new URLSearchParams(location.search);
    if (value.trim()) {
      params.set('query', value.trim());
    } else {
      params.delete('query');
    }
    navigate(`?${params.toString()}`);
  };

  const updateLocation = (value: string) => {
    setFilterData((prev: FilterData) => {
      if (value === 'other') {
        return {
          ...prev,
          locationValue: customLocation,
          locationDisplay: 'Other Location',
        };
      } else {
        const option = locationOptions.find((opt) => opt.value === value);
        return {
          ...prev,
          locationValue: value,
          locationDisplay: option?.label || '',
        };
      }
    });
  };
  
  const updateCategories = (categories: string[]) => {
    setFilterData((prev: FilterData) => ({
      ...prev,
      categories,
    }));
  };

  const clearAllFilters = () => {
    setSelectedDates([null, null]);
    setFilterData({
      locationValue: '',
      locationDisplay: '',
      categories: [],
    });
    setCustomLocation('');
    handleSearch('');
  };

  const hasActiveFilters = () => {
    return (
      searchQuery ||
      (selectedDates[0] && selectedDates[1]) ||
      filterData.locationValue ||
      filterData.categories.length > 0
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedDates[0] && selectedDates[1]) count++;
    if (filterData.locationValue) count++;
    if (filterData.categories.length > 0) count++;
    return count;
  };

  const formatDateLabel = () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      return 'Any Date';
    }
    return `${selectedDates[0].format('MMM DD')} - ${selectedDates[1].format(
      'MMM DD',
    )}`;
  };

  const handleDatePreset = (preset: string) => {
    // Toggle off if clicking the same preset
    if (activeDatePreset === preset) {
      setActiveDatePreset(null);
      setSelectedDates([null, null]);
      return;
    }

    setActiveDatePreset(preset);
    let startDate: Dayjs | null = null;
    let endDate: Dayjs | null = null;
    const today = dayjs();

    switch (preset) {
      case 'today':
        startDate = today.startOf('day');
        endDate = today.endOf('day');
        break;
      case 'tomorrow':
        const tomorrow = today.add(1, 'day');
        startDate = tomorrow.startOf('day');
        endDate = tomorrow.endOf('day');
        break;
      case 'this-week':
        startDate = today.startOf('week');
        endDate = today.endOf('week');
        break;
      case 'this-weekend':
        const thisSaturday = today.day(6);
        const thisSunday = today.day(0).add(1, 'week');
        startDate = thisSaturday.startOf('day');
        endDate = thisSunday.endOf('day');
        break;
    }

    if (startDate && endDate) {
      setSelectedDates([startDate, endDate]);
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (!value) return;
    
    // Use the browser's native date parsing instead of dayjs with strict format
    const newDate = dayjs(new Date(value));
    if (!newDate.isValid()) return;
    
    if (type === 'start') {
      setSelectedDates([newDate, selectedDates[1]]);
    } else {
      setSelectedDates([selectedDates[0], newDate]);
    }
  };

  return (
    <>
      {/* Compact Filter Bar */}
      <Box
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
          padding: '8px 16px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        {/* Search Bar */}
        <TextInput
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          leftSection={<IconSearch size="1rem" stroke={1.5} />}
          rightSection={
            <Group gap="xs">
              {searchQuery && (
                <ActionIcon
                  variant="transparent"
                  onClick={() => handleSearch('')}
                  size="sm"
                >
                  <IconX size="0.8rem" />
                </ActionIcon>
              )}
              <ActionIcon
                variant="light"
                color="blue"
                size="sm"
                onClick={() => setShowAdvanced(true)}
              >
                <IconFilter size="0.9rem" />
                {hasActiveFilters() && (
                  <Badge
                    size="xs"
                    color="red"
                    style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      minWidth: 'auto',
                      height: 16,
                      width: 16,
                      padding: 0,
                      fontSize: '10px',
                    }}
                  >
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </ActionIcon>
            </Group>
          }
          size="sm"
          radius="lg"
          mb="xs"
          styles={{
            input: {
              background: 'rgba(255,255,255,0.8)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
            },
          }}
        />

        {/* Quick Filters Row */}
        <Flex gap="xs" wrap="nowrap" align="center">
          {/* Quick Categories */}
          <Group gap="4px" wrap="nowrap">
            {categoryOptions.slice(0, 4).map((category) => (
              <Button
                key={category.value}
                variant={filterData.categories.includes(category.value) ? 'filled' : 'light'}
                color={category.color}
                size="xs"
                radius="xl"
                onClick={() => {
                  const newCategories = filterData.categories.includes(category.value)
                    ? filterData.categories.filter((c) => c !== category.value)
                    : [...filterData.categories, category.value];
                  updateCategories(newCategories);
                }}
                leftSection={<span style={{ fontSize: '10px' }}>{category.icon}</span>}
                styles={{
                  root: {
                    height: '24px',
                    padding: '0 8px',
                  },
                  label: {
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  },
                }}
              >
                {category.label}
              </Button>
            ))}
          </Group>

          <Divider orientation="vertical" size="xs" />

          {/* Quick Date Presets */}
          <Group gap="4px">
            {datePresets.map((preset) => (
              <Button
                key={preset.value}
                variant={activeDatePreset === preset.value ? 'filled' : 'light'}
                color="blue"
                size="xs"
                radius="xl"
                onClick={() => handleDatePreset(preset.value)}
                styles={{
                  root: {
                    height: '24px',
                    padding: '0 8px',
                  },
                  label: {
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  },
                }}
              >
                {preset.label}
              </Button>
            ))}
          </Group>

          {/* Clear Filters */}
          {hasActiveFilters() && (
            <>
              <Divider orientation="vertical" size="xs" />
              <ActionIcon
                variant="light"
                color="red"
                size="sm"
                radius="xl"
                onClick={clearAllFilters}
                title="Clear all filters"
              >
                <IconRefresh size={12} />
              </ActionIcon>
            </>
          )}
        </Flex>

        {/* Active Filters Summary - Very Compact */}
        {hasActiveFilters() && (
          <Group gap="4px" mt="4px">
            {filterData.categories.length > 0 && (
              <Text size="10px" c="dimmed">
                🏷️ {filterData.categories.length} categories
              </Text>
            )}
            {filterData.locationValue && (
              <Text size="10px" c="dimmed">
                📍 {filterData.locationDisplay || filterData.locationValue}
              </Text>
            )}
            {selectedDates[0] && selectedDates[1] && (
              <Text size="10px" c="dimmed">
                📅 {formatDateLabel()}
              </Text>
            )}
          </Group>
        )}
      </Box>

      {/* Advanced Filters Modal */}
      <Modal
        opened={showAdvanced}
        onClose={() => setShowAdvanced(false)}
        title="Advanced Filters"
        size="md"
        centered
        styles={{
          title: {
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          },
        }}
      >
        <Stack gap="md">
          {/* All Categories */}
          <Box>
            <Text size="sm" fw={600} mb="xs">
              All Categories
            </Text>
            <MultiSelect
              placeholder="Select categories..."
              data={categoryOptions.map((opt) => ({
                value: opt.value,
                label: `${opt.icon} ${opt.label}`,
              }))}
              value={filterData.categories}
              onChange={updateCategories}
              maxValues={8}
              searchable
              clearable
              size="sm"
              radius="lg"
            />
          </Box>

          {/* Date Range */}
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Custom Date Range
            </Text>
            <Group grow>
              <TextInput
                label="Start Date"
                type="date"
                value={selectedDates[0]?.format('YYYY-MM-DD') || ''}
                onChange={(e) => {
                  // Update the date immediately on change
                  if (e.target.value) {
                    const newDate = dayjs(new Date(e.target.value));
                    if (newDate.isValid()) {
                      setSelectedDates([newDate, selectedDates[1]]);
                    }
                  }
                }}
                size="sm"
                radius="lg"
              />
              <TextInput
                label="End Date"
                type="date"
                value={selectedDates[1]?.format('YYYY-MM-DD') || ''}
                onChange={(e) => {
                  // Update the date immediately on change
                  if (e.target.value) {
                    const newDate = dayjs(new Date(e.target.value));
                    if (newDate.isValid()) {
                      setSelectedDates([selectedDates[0], newDate]);
                    }
                  }
                }}
                size="sm"
                radius="lg"
              />
            </Group>
          </Box>

          {/* Location */}
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Location
            </Text>
            <Group grow>
              <Select
                placeholder="Select location..."
                data={locationOptions}
                value={
                  filterData.locationValue === customLocation && customLocation
                    ? 'other'
                    : filterData.locationValue
                }
                onChange={(value) => updateLocation(value || '')}
                clearable
                size="sm"
                radius="lg"
              />
              {(filterData.locationValue === 'other' ||
                (filterData.locationValue &&
                  !locationOptions.find(
                    (opt) => opt.value === filterData.locationValue,
                  ))) && (
                <TextInput
                  placeholder="Enter custom location"
                  value={customLocation}
                  onChange={(e) => {
                    setCustomLocation(e.target.value);
                    setFilterData({
                      ...filterData,
                      locationValue: e.target.value,
                      locationDisplay: 'Other Location',
                    });
                  }}
                  size="sm"
                  radius="lg"
                />
              )}
            </Group>
          </Box>

          {/* Action Buttons */}
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              color="red"
              size="sm"
              onClick={clearAllFilters}
              leftSection={<IconRefresh size={14} />}
            >
              Clear All
            </Button>
            <Button size="sm" onClick={() => setShowAdvanced(false)}>
              Apply Filters
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};
