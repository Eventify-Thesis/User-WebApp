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

interface ModernEventFiltersProps {
  selectedDates: [Dayjs | null, Dayjs | null];
  setSelectedDates: (dates: [Dayjs | null, Dayjs | null]) => void;
  filterData: FilterData;
  setFilterData: (data: FilterData) => void;
}

const categoryOptions = [
  { value: 'music', label: 'Live Music', color: 'pink', icon: '🎵' },
  { value: 'art', label: 'Theater & Arts', color: 'violet', icon: '🎭' },
  { value: 'sport', label: 'Sports', color: 'red', icon: '⚽' },
  { value: 'tech', label: 'Tech Conference', color: 'blue', icon: '💻' },
  { value: 'workshop', label: 'Workshop', color: 'indigo', icon: '🛠️' },
  { value: 'food', label: 'Food & Drinks', color: 'orange', icon: '🍕' },
  { value: 'business', label: 'Business', color: 'teal', icon: '💼' },
  { value: 'networking', label: 'Networking', color: 'lime', icon: '🤝' },
  {
    value: 'entertainment',
    label: 'Entertainment',
    color: 'grape',
    icon: '🎪',
  },
  { value: 'education', label: 'Education', color: 'cyan', icon: '📚' },
  { value: 'other', label: 'Other', color: 'gray', icon: '🔮' },
];

const locationOptions = [
  { value: '', label: 'All Locations' },
  { value: 'ho-chi-minh', label: 'Ho Chi Minh City' },
  { value: 'hanoi', label: 'Hanoi' },
  { value: 'da-nang', label: 'Da Nang' },
  { value: 'hue', label: 'Hue' },
  { value: 'can-tho', label: 'Can Tho' },
  { value: 'nha-trang', label: 'Nha Trang' },
  { value: 'other', label: 'Other Location' },
];

const datePresets = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-weekend', label: 'This Weekend' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'this-month', label: 'This Month' },
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

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
    if (value === 'other') {
      setFilterData({
        ...filterData,
        locationValue: customLocation,
        locationDisplay: 'Other Location',
      });
    } else {
      const option = locationOptions.find((opt) => opt.value === value);
      setFilterData({
        ...filterData,
        locationValue: value,
        locationDisplay: option?.label || '',
      });
    }
  };

  const updateCategories = (categories: string[]) => {
    setFilterData({
      ...filterData,
      categories,
    });
  };

  const clearAllFilters = () => {
    setSelectedDates([null, null]);
    setFilterData({
      locationValue: '',
      locationDisplay: '',
      categories: [],
    });
    setCustomLocation('');
  };

  const removeFilter = (type: string, value?: string) => {
    switch (type) {
      case 'dates':
        setSelectedDates([null, null]);
        break;
      case 'location':
        setFilterData({
          ...filterData,
          locationValue: '',
          locationDisplay: '',
        });
        setCustomLocation('');
        break;
      case 'category':
        if (value) {
          updateCategories(filterData.categories.filter((c) => c !== value));
        } else {
          updateCategories([]);
        }
        break;
    }
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

  const getCategoryOption = (value: string) =>
    categoryOptions.find((opt) => opt.value === value);

  const formatDateLabel = () => {
    if (!selectedDates[0] || !selectedDates[1]) {
      return t('filters.allDays', 'All Days');
    }

    return `${selectedDates[0].format('MMM DD')} - ${selectedDates[1].format(
      'MMM DD',
    )}`;
  };

  const handleDatePreset = (preset: string) => {
    const today = dayjs();
    let startDate: Dayjs | null = null;
    let endDate: Dayjs | null = null;

    switch (preset) {
      case 'today':
        startDate = today.startOf('day');
        endDate = today.endOf('day');
        break;
      case 'tomorrow':
        startDate = today.add(1, 'day').startOf('day');
        endDate = today.add(1, 'day').endOf('day');
        break;
      case 'this-week':
        startDate = today.startOf('week');
        endDate = today.endOf('week');
        break;
      case 'this-weekend':
        const thisSaturday = today.day(6);
        const thisSunday = today.day(7);
        startDate = thisSaturday.startOf('day');
        endDate = thisSunday.endOf('day');
        break;
      case 'next-week':
        startDate = today.add(1, 'week').startOf('week');
        endDate = today.add(1, 'week').endOf('week');
        break;
      case 'this-month':
        startDate = today.startOf('month');
        endDate = today.endOf('month');
        break;
    }

    if (startDate && endDate) {
      setSelectedDates([startDate, endDate]);
    }
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (!value) return;

    const newDate = dayjs(value);
    if (type === 'start') {
      setSelectedDates([newDate, selectedDates[1]]);
    } else {
      setSelectedDates([selectedDates[0], newDate]);
    }
  };

  return (
    <Card
      shadow="sm"
      padding={isExpanded ? 'lg' : 'md'}
      radius="lg"
      style={{
        background:
          'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        position: 'relative',
        overflow: 'visible',
        margin: isExpanded ? '16px' : '8px',
      }}
    >
      {/* Collapsed Header - Show search + filters in one row */}
      {!isExpanded && (
        <Flex gap="sm" align="center" justify="space-between" wrap="wrap">
          {/* Search Bar - More compact */}
          <Box style={{ flex: '1 1 200px', minWidth: '200px' }}>
            <TextInput
              placeholder={t('filters.searchPlaceholder', 'Search events...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftSection={<IconSearch size="1rem" stroke={1.5} />}
              rightSection={
                searchQuery ? (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => handleSearch('')}
                    size="sm"
                  >
                    <IconX size="0.8rem" />
                  </ActionIcon>
                ) : null
              }
              size="sm"
              radius="lg"
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                },
              }}
            />
          </Box>

          {/* Active Filters Summary - Compact */}
          {hasActiveFilters() && (
            <Group gap="xs" style={{ flex: '0 0 auto' }}>
              {filterData.categories.length > 0 && (
                <Badge size="xs" variant="light" color="violet">
                  {filterData.categories.length} categories
                </Badge>
              )}
              {filterData.locationValue && (
                <Badge size="xs" variant="light" color="green">
                  📍 {filterData.locationDisplay || filterData.locationValue}
                </Badge>
              )}
              {selectedDates[0] && selectedDates[1] && (
                <Badge size="xs" variant="light" color="orange">
                  📅 {formatDateLabel()}
                </Badge>
              )}
            </Group>
          )}

          {/* Expand/Clear Controls */}
          <Group gap="xs" style={{ flex: '0 0 auto' }}>
            {hasActiveFilters() && (
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
            )}

            <Button
              variant="subtle"
              size="xs"
              rightSection={
                <IconChevronDown
                  size={12}
                  style={{
                    transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              }
              onClick={() => setIsExpanded(!isExpanded)}
              style={{ color: '#6b7280' }}
            >
              {hasActiveFilters()
                ? `${getActiveFiltersCount()} filters`
                : 'Filters'}
            </Button>
          </Group>
        </Flex>
      )}

      {/* Expanded Header - Original layout */}
      {isExpanded && (
        <>
          {/* Search Bar */}
          <Box mb="md">
            <TextInput
              placeholder={t('filters.searchPlaceholder', 'Search events...')}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              leftSection={<IconSearch size="1.1rem" stroke={1.5} />}
              rightSection={
                searchQuery ? (
                  <ActionIcon
                    variant="transparent"
                    onClick={() => handleSearch('')}
                    size="sm"
                  >
                    <IconX size="1rem" />
                  </ActionIcon>
                ) : null
              }
              size="md"
              radius="lg"
              styles={{
                input: {
                  background: 'rgba(255,255,255,0.8)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                },
              }}
            />
          </Box>

          {/* Compact Header */}
          <Flex justify="space-between" align="center" mb="md">
            <Group gap="sm">
              <Box
                style={{
                  background:
                    'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                  borderRadius: '8px',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconSparkles size={16} color="white" />
              </Box>
              <Text fw={600} size="md" c="dark">
                {t('filters.searchResult', 'Event Filters')}
              </Text>
              {hasActiveFilters() && (
                <Badge size="sm" color="blue" circle>
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Group>

            <Group gap="xs">
              {hasActiveFilters() && (
                <ActionIcon
                  variant="light"
                  color="red"
                  size="sm"
                  radius="xl"
                  onClick={clearAllFilters}
                  title="Clear all filters"
                >
                  <IconRefresh size={14} />
                </ActionIcon>
              )}

              <Button
                variant="subtle"
                size="xs"
                rightSection={
                  <IconChevronDown
                    size={14}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                    }}
                  />
                }
                onClick={() => setIsExpanded(!isExpanded)}
                style={{ color: '#6b7280' }}
              >
                {isExpanded ? 'Less' : 'More'}
              </Button>
            </Group>
          </Flex>
        </>
      )}

      <Stack gap="md">
        {/* Quick Category Chips - Only show when expanded */}
        {isExpanded && (
          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="sm">
              Popular Categories
            </Text>
            <Group gap="xs">
              {categoryOptions.slice(0, 5).map((category) => (
                <Chip
                  key={category.value}
                  checked={filterData.categories.includes(category.value)}
                  onChange={(checked) => {
                    const newCategories = checked
                      ? [...filterData.categories, category.value]
                      : filterData.categories.filter(
                          (c) => c !== category.value,
                        );
                    updateCategories(newCategories);
                  }}
                  color={category.color}
                  variant="light"
                  size="sm"
                  radius="xl"
                  styles={{
                    label: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontWeight: 500,
                      fontSize: '12px',
                    },
                  }}
                >
                  <span>{category.icon}</span>
                  {category.label}
                </Chip>
              ))}
            </Group>
          </Box>
        )}

        {/* Date Quick Presets - Only show when expanded */}
        {isExpanded && (
          <Box>
            <Text size="sm" fw={600} c="dimmed" mb="sm">
              <IconCalendar size={14} style={{ marginRight: '4px' }} />
              {formatDateLabel()}
            </Text>
            <Group gap="xs">
              {datePresets.slice(0, 4).map((preset) => (
                <Button
                  key={preset.value}
                  variant="light"
                  size="xs"
                  radius="xl"
                  onClick={() => handleDatePreset(preset.value)}
                  style={{ fontSize: '11px' }}
                >
                  {preset.label}
                </Button>
              ))}
            </Group>
          </Box>
        )}

        {/* Collapsible Advanced Filters */}
        <Transition
          mounted={isExpanded}
          transition="slide-down"
          duration={300}
          timingFunction="ease"
        >
          {(styles) => (
            <Card
              style={{
                ...styles,
                background: 'rgba(248, 250, 252, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.1)',
              }}
              p="md"
            >
              <Stack gap="md">
                {/* All Categories Selector */}
                <Box>
                  <Text size="sm" fw={600} c="dimmed" mb="sm">
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
                    styles={{
                      input: {
                        background: 'rgba(255,255,255,0.8)',
                        border: '1px solid rgba(59, 130, 246, 0.2)',
                      },
                    }}
                  />
                </Box>

                {/* Advanced Date Range */}
                <Box>
                  <Text size="sm" fw={600} c="dimmed" mb="sm">
                    Custom Date Range
                  </Text>
                  <Group grow>
                    <TextInput
                      label="Start Date"
                      type="date"
                      value={selectedDates[0]?.format('YYYY-MM-DD') || ''}
                      onChange={(e) =>
                        handleDateChange('start', e.target.value)
                      }
                      size="sm"
                      radius="lg"
                      styles={{
                        input: {
                          background: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        },
                        label: {
                          fontWeight: 600,
                          fontSize: '13px',
                        },
                      }}
                    />
                    <TextInput
                      label="End Date"
                      type="date"
                      value={selectedDates[1]?.format('YYYY-MM-DD') || ''}
                      onChange={(e) => handleDateChange('end', e.target.value)}
                      size="sm"
                      radius="lg"
                      styles={{
                        input: {
                          background: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        },
                        label: {
                          fontWeight: 600,
                          fontSize: '13px',
                        },
                      }}
                    />
                  </Group>
                </Box>

                {/* Location Selector */}
                <Box>
                  <Text size="sm" fw={600} c="dimmed" mb="sm">
                    <IconMapPin size={14} style={{ marginRight: '4px' }} />
                    Location
                  </Text>
                  <Group grow>
                    <Select
                      placeholder="Select location..."
                      data={locationOptions}
                      value={
                        filterData.locationValue === customLocation &&
                        customLocation
                          ? 'other'
                          : filterData.locationValue
                      }
                      onChange={(value) => updateLocation(value || '')}
                      clearable
                      size="sm"
                      radius="lg"
                      styles={{
                        input: {
                          background: 'rgba(255,255,255,0.8)',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                        },
                      }}
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
                        styles={{
                          input: {
                            background: 'rgba(255,255,255,0.8)',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                          },
                        }}
                      />
                    )}
                  </Group>
                </Box>

                {/* More Date Presets */}
                <Box>
                  <Text size="sm" fw={600} c="dimmed" mb="sm">
                    More Date Options
                  </Text>
                  <Group gap="xs">
                    {datePresets.slice(4).map((preset) => (
                      <Button
                        key={preset.value}
                        variant="light"
                        size="xs"
                        radius="xl"
                        onClick={() => handleDatePreset(preset.value)}
                        style={{ fontSize: '11px' }}
                      >
                        {preset.label}
                      </Button>
                    ))}
                  </Group>
                </Box>
              </Stack>
            </Card>
          )}
        </Transition>

        {/* Active Filters Display - Only show when filters are active and expanded */}
        {isExpanded && hasActiveFilters() && (
          <Box>
            <Text size="xs" fw={600} c="dimmed" mb="xs">
              Active Filters:
            </Text>
            <Group gap="xs">
              {selectedDates[0] && selectedDates[1] && (
                <Badge
                  variant="light"
                  color="purple"
                  leftSection={<IconCalendar size={10} />}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={() => removeFilter('dates')}
                    >
                      <IconX size={8} />
                    </ActionIcon>
                  }
                  radius="lg"
                  size="sm"
                >
                  {formatDateLabel()}
                </Badge>
              )}

              {filterData.locationValue && (
                <Badge
                  variant="light"
                  color="green"
                  leftSection={<IconMapPin size={10} />}
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={() => removeFilter('location')}
                    >
                      <IconX size={8} />
                    </ActionIcon>
                  }
                  radius="lg"
                  size="sm"
                >
                  {filterData.locationDisplay || filterData.locationValue}
                </Badge>
              )}

              {filterData.categories.map((category) => {
                const categoryOpt = getCategoryOption(category);
                return (
                  <Badge
                    key={category}
                    variant="light"
                    color={categoryOpt?.color || 'blue'}
                    leftSection={
                      <span style={{ fontSize: '8px' }}>
                        {categoryOpt?.icon}
                      </span>
                    }
                    rightSection={
                      <ActionIcon
                        size="xs"
                        variant="transparent"
                        onClick={() => removeFilter('category', category)}
                      >
                        <IconX size={8} />
                      </ActionIcon>
                    }
                    radius="lg"
                    size="sm"
                  >
                    {categoryOpt?.label || category}
                  </Badge>
                );
              })}
            </Group>
          </Box>
        )}
      </Stack>
    </Card>
  );
};
