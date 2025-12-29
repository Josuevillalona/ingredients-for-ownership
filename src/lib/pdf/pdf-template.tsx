import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import type { IngredientDocument, IngredientSelection } from '@/lib/types/ingredient-document';
import type { FoodItem } from '@/lib/types';
import { getPDFCategoryConfig } from './category-mapping';
import path from 'path';
import fs from 'fs';

// Register fonts lazily on first use
let fontsRegistered = false;

function registerFonts() {
  if (fontsRegistered) return;

  const publicDir = path.join(process.cwd(), 'public');
  const fontsDir = path.join(publicDir, 'fonts');

  Font.register({
    family: 'Prompt',
    fonts: [
      { src: path.join(fontsDir, 'Prompt-Regular.ttf') },
      { src: path.join(fontsDir, 'Prompt-Bold.ttf'), fontWeight: 'bold' },
      { src: path.join(fontsDir, 'Prompt-Italic.ttf'), fontStyle: 'italic' },
      { src: path.join(fontsDir, 'Prompt-Medium.ttf'), fontWeight: 500 },
      { src: path.join(fontsDir, 'Prompt-SemiBold.ttf'), fontWeight: 600 },
    ]
  });

  fontsRegistered = true;
}

// Brand colors from your Tailwind config
const BRAND_COLORS = {
  dark: '#191B24',
  gold: '#BD9A60',
  white: '#FFFFFF',
  cream: '#FFF7EF',
  blue: {
    text: '#5B9BD5', // Adjusted to match example
    dot: '#5B9BD5'
  },
  yellow: {
    text: '#FFC000', // Adjusted to match example
    dot: '#FFC000'
  },
  red: {
    text: '#FF0000', // Adjusted to match example
    dot: '#FF0000'
  }
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: BRAND_COLORS.white,
    padding: 20,
    fontFamily: 'Prompt',
    position: 'relative'
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    minWidth: '100%',
    minHeight: '100%',
    height: '100%',
    width: '100%',
    opacity: 0.15,
    zIndex: -1,
    objectFit: 'cover'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 5
  },
  headerLeft: {
    flexDirection: 'column'
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 3
  },
  titleMain: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND_COLORS.dark,
    letterSpacing: 0.5,
    marginRight: 4
  },
  titleSub: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND_COLORS.gold,
    letterSpacing: 0.5
  },
  subtitle: {
    fontSize: 9,
    color: BRAND_COLORS.dark,
  },
  clientName: {
    fontSize: 11,
    fontWeight: 600,
    color: BRAND_COLORS.gold,
    marginTop: 4,
    letterSpacing: 0.5
  },
  logo: {
    width: 80,
    height: 'auto'
  },
  legendSection: {
    marginBottom: 10,
    paddingVertical: 3,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: BRAND_COLORS.gold,
    flexDirection: 'column'
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 1
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 4
  },
  legendText: {
    fontSize: 7,
    color: '#444'
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryColumn: {
    marginRight: 8,
    marginBottom: 10
  },
  categoryHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    color: BRAND_COLORS.white,
    backgroundColor: BRAND_COLORS.dark,
    padding: 3,
    textAlign: 'center',
    marginBottom: 3
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2.5,
    paddingLeft: 1
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 6
  },
  checkbox: {
    width: 7,
    height: 7,
    borderWidth: 0.4,
    borderColor: '#999',
    marginLeft: 4
  },
  foodName: {
    fontSize: 7,
    color: BRAND_COLORS.dark,
    flex: 1
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    paddingTop: 6
  },
  coachInfo: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center'
  }
});

interface PDFTemplateProps {
  document: IngredientDocument;
  foods: FoodItem[];
  coachName?: string;
  coachContact?: string;
  columns?: number;
}

interface OrganizedCategory {
  categoryId: string;
  displayName: string;
  description: string;
  order: number;
  ingredients: Array<{
    ingredient: IngredientSelection;
    food: FoodItem;
  }>;
}

export const IngredientPDFTemplate: React.FC<PDFTemplateProps> = ({
  document,
  foods,
  coachName,
  coachContact,
  columns = 3
}) => {
  // Register fonts
  registerFonts();

  // Load assets and convert to base64 data URIs
  const publicDir = path.join(process.cwd(), 'public');

  // Read and encode background image
  const backgroundPath = path.join(publicDir, 'PDF-background.png');
  const backgroundBuffer = fs.readFileSync(backgroundPath);
  const backgroundBase64 = `data:image/png;base64,${backgroundBuffer.toString('base64')}`;

  // Read and encode logo
  const logoPath = path.join(publicDir, 'OI logos', 'Normal Light (1).png');
  const logoBuffer = fs.readFileSync(logoPath);
  const logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;

  // Organize ingredients by category
  const organizedCategories = organizeIngredientsByCategory(document, foods);

  // Calculate column width
  const columnWidth = `${100 / columns}%`;

  return (
    <Document>
      <Page size="LETTER" orientation="landscape" style={styles.page}>
        {/* Background Image */}
        <Image
          src={backgroundBase64}
          style={styles.background}
        />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.titleRow}>
              <Text style={styles.titleMain}>INGREDIENTS FOR</Text>
              <Text style={styles.titleSub}>OWNERSHIP</Text>
            </View>
            <Text style={styles.subtitle}>Your Personalized Guide to Make Therapeutic Food & Beverage Choices</Text>
            <Text style={styles.clientName}>{document.clientName}</Text>
          </View>
          <Image
            src={logoBase64}
            style={styles.logo}
          />
        </View>

        {/* Legend */}
        <View style={styles.legendSection}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#81D4FA' }]} />
            <Text style={styles.legendText}>Therapeutic; offers specific nutrients or compounds that benefit your body's unique needs</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC000' }]} />
            <Text style={styles.legendText}>Healthful; can be included as part of your balanced, whole-food eating pattern</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF5252' }]} />
            <Text style={styles.legendText}>Best consumed only occasionally and/or in smaller, moderate amounts</Text>
          </View>
        </View>

        {/* Category Grid */}
        < View style={styles.categoryGrid} >
          {
            organizedCategories.map((category) => (
              <View key={category.categoryId} style={[styles.categoryColumn, { width: columnWidth }]}>
                <Text style={styles.categoryHeader}>{category.displayName}</Text>

                {category.ingredients.map(({ ingredient, food }, idx) => {
                  const colorCode = ingredient.colorCode || 'blue';
                  let dotColor = BRAND_COLORS.blue.dot;
                  if (colorCode === 'yellow') dotColor = BRAND_COLORS.yellow.dot;
                  if (colorCode === 'red') dotColor = BRAND_COLORS.red.dot;

                  // Map to the example colors
                  if (colorCode === 'blue') dotColor = '#81D4FA';
                  if (colorCode === 'yellow') dotColor = '#FFC000';
                  if (colorCode === 'red') dotColor = '#FF5252';

                  return (
                    <View key={`${ingredient.foodId}-${idx}`} style={styles.foodItem}>
                      <View style={[styles.dot, { backgroundColor: dotColor }]} />
                      <Text style={styles.foodName}>{food.name.toUpperCase()}</Text>
                      <View style={styles.checkbox} />
                    </View>
                  );
                })}
              </View>
            ))
          }
        </View >

        {/* Footer */}
        < View style={styles.footer} >
          {(coachName || coachContact) && (
            <Text style={styles.coachInfo}>
              {coachName && `Your Coach: ${coachName}`}
              {coachName && coachContact && ' | '}
              {coachContact && coachContact}
            </Text>
          )}
        </View >
      </Page >
    </Document >
  );
};

/**
 * Organize ingredients by category for PDF display
 */
function organizeIngredientsByCategory(
  document: IngredientDocument,
  foods: FoodItem[]
): OrganizedCategory[] {
  // Group selected ingredients by category
  const categoryMap = new Map<string, OrganizedCategory>();

  document.ingredients
    .filter(ingredient => ingredient.isSelected && ingredient.colorCode)
    .forEach(ingredient => {
      const food = foods.find(f => f.id === ingredient.foodId);
      if (!food) return;

      // Determine category (use AI category or fallback to 'other')
      const categoryId = determineFoodCategory(food);

      if (!categoryMap.has(categoryId)) {
        const config = getPDFCategoryConfig(categoryId);
        categoryMap.set(categoryId, {
          categoryId,
          displayName: config.displayName,
          description: config.description,
          order: config.order,
          ingredients: []
        });
      }

      categoryMap.get(categoryId)!.ingredients.push({
        ingredient,
        food
      });
    });

  // Sort categories by order, then sort ingredients within each category
  return Array.from(categoryMap.values())
    .sort((a, b) => a.order - b.order)
    .map(category => ({
      ...category,
      ingredients: category.ingredients.sort((a, b) => {
        // Sort by color (blue, yellow, red) then alphabetically
        const colorOrder = { blue: 0, yellow: 1, red: 2 };
        const colorA = a.ingredient.colorCode || 'blue';
        const colorB = b.ingredient.colorCode || 'blue';
        const colorDiff = colorOrder[colorA] - colorOrder[colorB];
        return colorDiff !== 0 ? colorDiff : a.food.name.localeCompare(b.food.name);
      })
    }));
}

/**
 * Determine food category from FoodItem
 */
function determineFoodCategory(food: FoodItem): string {
  // Use AI-assigned category if available
  if (food.category) {
    return food.category;
  }

  // Fallback: categorize based on tags
  const tags = food.tags.map(tag => tag.toLowerCase());

  if (tags.some(tag => tag.includes('meat') || tag.includes('poultry'))) return 'meat-poultry';
  if (tags.some(tag => tag.includes('fish') || tag.includes('seafood'))) return 'seafood';
  if (tags.some(tag => tag.includes('egg') || tag.includes('dairy'))) return 'eggs-dairy';
  if (tags.some(tag => tag.includes('bean') || tag.includes('lentil') || tag.includes('legume'))) return 'legumes';
  if (tags.some(tag => tag.includes('grain') || tag.includes('rice') || tag.includes('oat'))) return 'grains';
  if (tags.some(tag => tag.includes('nut') || tag.includes('seed'))) return 'nuts-seeds';
  if (tags.some(tag => tag.includes('vegetable'))) return 'vegetables';
  if (tags.some(tag => tag.includes('fruit'))) return 'fruits';

  return 'other';
}
