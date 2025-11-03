import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import type { IngredientDocument, IngredientSelection } from '@/lib/types/ingredient-document';
import type { FoodItem } from '@/lib/types';
import { getPDFCategoryConfig } from './category-mapping';

// Brand colors from your Tailwind config
const BRAND_COLORS = {
  dark: '#191B24',
  gold: '#BD9A60',
  white: '#FDFDFD',
  cream: '#FFF7EF',
  blue: {
    bg: '#DBEAFE',
    text: '#1E40AF',
    border: '#BFDBFE'
  },
  yellow: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#FDE68A'
  },
  red: {
    bg: '#FEE2E2',
    text: '#991B1B',
    border: '#FECACA'
  }
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: BRAND_COLORS.white,
    padding: 30,
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLORS.gold,
    paddingBottom: 15
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_COLORS.dark,
    textAlign: 'center',
    marginBottom: 5,
    letterSpacing: 1
  },
  subtitle: {
    fontSize: 14,
    color: BRAND_COLORS.gold,
    textAlign: 'center',
    marginBottom: 5
  },
  clientName: {
    fontSize: 16,
    color: BRAND_COLORS.dark,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  legendSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: BRAND_COLORS.cream,
    borderRadius: 5
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  legendIndicator: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 5
  },
  legendText: {
    fontSize: 9
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20
  },
  categoryColumn: {
    borderWidth: 1,
    borderColor: BRAND_COLORS.gold,
    borderRadius: 3,
    padding: 8,
    marginRight: 8,
    marginBottom: 8
  },
  categoryHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    color: BRAND_COLORS.dark,
    textAlign: 'center',
    marginBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.gold,
    paddingBottom: 3
  },
  categoryDescription: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic'
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    padding: 3,
    borderRadius: 2
  },
  foodItemBlue: {
    backgroundColor: BRAND_COLORS.blue.bg
  },
  foodItemYellow: {
    backgroundColor: BRAND_COLORS.yellow.bg
  },
  foodItemRed: {
    backgroundColor: BRAND_COLORS.red.bg
  },
  colorIndicator: {
    fontSize: 8,
    fontWeight: 'bold',
    marginRight: 5,
    minWidth: 15
  },
  colorIndicatorBlue: {
    color: BRAND_COLORS.blue.text
  },
  colorIndicatorYellow: {
    color: BRAND_COLORS.yellow.text
  },
  colorIndicatorRed: {
    color: BRAND_COLORS.red.text
  },
  foodName: {
    fontSize: 8,
    flex: 1
  },
  foodNameBlue: {
    color: BRAND_COLORS.blue.text
  },
  foodNameYellow: {
    color: BRAND_COLORS.yellow.text
  },
  foodNameRed: {
    color: BRAND_COLORS.red.text
  },
  footer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.gold
  },
  instructionsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_COLORS.dark,
    marginBottom: 8
  },
  instructionItem: {
    fontSize: 9,
    color: '#333',
    marginBottom: 4
  },
  coachInfo: {
    marginTop: 15,
    fontSize: 9,
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
  // Organize ingredients by category
  const organizedCategories = organizeIngredientsByCategory(document, foods);
  
  // Calculate column width based on number of columns
  const columnWidth = `${(100 / columns) - 2}%`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INGREDIENTS FOR OWNERSHIP</Text>
          <Text style={styles.subtitle}>Your Personalized Nutrition Guide</Text>
          <Text style={styles.clientName}>{document.clientName}</Text>
        </View>

        {/* Color Legend */}
        <View style={styles.legendSection}>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIndicator, styles.colorIndicatorBlue]}>(B) Blue Foods</Text>
            <Text style={styles.legendText}>Unlimited</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIndicator, styles.colorIndicatorYellow]}>(Y) Yellow Foods</Text>
            <Text style={styles.legendText}>Moderate</Text>
          </View>
          <View style={styles.legendItem}>
            <Text style={[styles.legendIndicator, styles.colorIndicatorRed]}>(R) Red Foods</Text>
            <Text style={styles.legendText}>Limited</Text>
          </View>
        </View>

        {/* Category Grid */}
        <View style={styles.categoryGrid}>
          {organizedCategories.map((category) => (
            <View key={category.categoryId} style={[styles.categoryColumn, { width: columnWidth }]}>
              <Text style={styles.categoryHeader}>{category.displayName}</Text>
              {category.description && (
                <Text style={styles.categoryDescription}>{category.description}</Text>
              )}
              
              {category.ingredients.map(({ ingredient, food }, idx) => {
                const colorCode = ingredient.colorCode || 'blue';
                
                // Build style arrays - use type assertion for React PDF compatibility
                const foodItemStyle: any[] = [styles.foodItem];
                if (colorCode === 'blue') foodItemStyle.push(styles.foodItemBlue);
                if (colorCode === 'yellow') foodItemStyle.push(styles.foodItemYellow);
                if (colorCode === 'red') foodItemStyle.push(styles.foodItemRed);
                
                const indicatorStyle: any[] = [styles.colorIndicator];
                if (colorCode === 'blue') indicatorStyle.push(styles.colorIndicatorBlue);
                if (colorCode === 'yellow') indicatorStyle.push(styles.colorIndicatorYellow);
                if (colorCode === 'red') indicatorStyle.push(styles.colorIndicatorRed);
                
                const nameStyle: any[] = [styles.foodName];
                if (colorCode === 'blue') nameStyle.push(styles.foodNameBlue);
                if (colorCode === 'yellow') nameStyle.push(styles.foodNameYellow);
                if (colorCode === 'red') nameStyle.push(styles.foodNameRed);

                return (
                  <View key={`${ingredient.foodId}-${idx}`} style={foodItemStyle}>
                    <Text style={indicatorStyle}>
                      {colorCode === 'blue' ? '(B)' : colorCode === 'yellow' ? '(Y)' : '(R)'}
                    </Text>
                    <Text style={nameStyle}>{food.name}</Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.instructionsTitle}>How to Use This Guide:</Text>
          <Text style={styles.instructionItem}>
            <Text style={{ fontWeight: 'bold' }}>Blue Foods:</Text> Eat freely as the foundation of your meals
          </Text>
          <Text style={styles.instructionItem}>
            <Text style={{ fontWeight: 'bold' }}>Yellow Foods:</Text> Include in appropriate portions for balanced nutrition
          </Text>
          <Text style={styles.instructionItem}>
            <Text style={{ fontWeight: 'bold' }}>Red Foods:</Text> Enjoy occasionally and in moderation
          </Text>
          
          {(coachName || coachContact) && (
            <Text style={styles.coachInfo}>
              {coachName && `Your Coach: ${coachName}`}
              {coachName && coachContact && ' | '}
              {coachContact && coachContact}
            </Text>
          )}
        </View>
      </Page>
    </Document>
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
