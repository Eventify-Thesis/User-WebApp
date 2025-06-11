"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, Box, Container, Title } from "@mantine/core";
import { createStyles } from "@mantine/styles";
import { IconPalette, IconHeartHandshake, IconSchool, IconMusic, IconBarbell, IconDeviceDesktop, IconQuestionMark } from "@tabler/icons-react";

interface Category {
  name: string;
  id: string;
  code: string;
  image: string;
  deeplink?: string;
}

interface CategorySectionProps {
  categories: Category[];
  onCategoryClick: (code: string) => void;
}

// @ts-ignore
// Create styles for components
const useStyles = createStyles((theme) => ({
  categorySection: {
    backgroundColor: '#f4f7fc !important',
  },
  categoryItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    padding: theme.spacing.xs,
    transition: 'all 0.25s ease',
    '&:hover': {
      transform: 'translateY(-3px)',
      '& .categoryIcon': {
        transform: 'scale(1.1)',
      }
    },
  },
  
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: 60,
    height: 60,
    boxShadow: '0 3px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: 10,
    transition: 'transform 0.3s ease',
  },
  art: {
    backgroundColor: '#FFD700',
  },
  charity: {
    backgroundColor: '#FF6B6B',
  },
  education: {
    backgroundColor: '#4DABF7',
  },
  music: {
    backgroundColor: '#9775FA',
  },
  sport: {
    backgroundColor: '#69DB7C',
  },
  technology: {
    backgroundColor: '#15AABF',
  },
  categoryName: {
    fontWeight: 'bold !important',
    fontSize: '0.9rem',
    color: 'black !important',
    textAlign: 'center',
    marginTop: 4,
  },
  sectionTitle: {
    color: 'black !important',
    fontWeight: 700,
    fontSize: 24,
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    '&::after': {
      content: '""',
      display: 'block',
      width: 40,
      height: 3,
      backgroundColor: 'black !important',
      margin: '8px auto',
      borderRadius: theme.radius.sm,
    }
  },
  categoryScroll: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${theme.spacing.md}px 0`,
    overflowX: 'auto',
    width: '100%',
    '&::-webkit-scrollbar': {
      height: 4,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.gray[4],
      borderRadius: 4,
    },
  }
}));
// @ts-check

// Map category codes to icons
const getCategoryIcon = (code: string) => {
  const iconSize = 36;
  const iconProps = { size: iconSize, stroke: 1.5, color: "#FFFFFF" };
  
  switch (code) {
    case "art":
      return <IconPalette {...iconProps} />;
    case "charity":
      return <IconHeartHandshake {...iconProps} />;
    case "education":
      return <IconSchool {...iconProps} />;
    case "music":
      return <IconMusic {...iconProps} />;
    case "sport":
      return <IconBarbell {...iconProps} />;
    case "technology":
      return <IconDeviceDesktop {...iconProps} />;
    default:
      return <IconQuestionMark {...iconProps} />;
  }
};

const CategoryItem = ({ category, onCategoryClick }: { category: Category; onCategoryClick: (code: string) => void }) => {
  const { classes, cx } = useStyles();
  
  // Get category-specific background color class
  const categoryColorClass = classes[category.code as keyof typeof classes];
  
  return (
    <Box 
      className={classes.categoryItem}
      onClick={() => onCategoryClick(category.code)}
    >
      <Box 
        className={cx(classes.iconWrapper, categoryColorClass, 'categoryIcon')}
      >
        {getCategoryIcon(category.code)}
      </Box>

      <Text className={classes.categoryName}>
        {category.name}
      </Text>
    </Box>
  );
};

export const CategorySection: React.FC<CategorySectionProps> = ({ categories, onCategoryClick }) => {
  const { t } = useTranslation();
  const { classes } = useStyles();

  return (
    <Box py="lg" px="md" style={{
      margin: '20px 0',
    }}
    className={classes.categorySection}
    >
      <Container size="xl">
        <Title order={2} className={classes.sectionTitle}>
          {t('categories')}
        </Title>

        <Box className={classes.categoryScroll}>
          {categories?.map((category) => (
            <CategoryItem 
              key={category.id}
              category={category} 
              onCategoryClick={onCategoryClick} 
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
};
