# FDC API Integration Usage Guide

## Overview

The FoodData Central (FDC) API integration provides access to the USDA's comprehensive food database containing 300,000+ food items. This integration automatically categorizes foods into our blue/yellow/red system and provides detailed nutritional information.

## Setup Requirements

### 1. Environment Configuration

Add your FDC API key to your environment variables:

```bash
# .env.local
FDC_API_KEY=your_usda_fdc_api_key_here
```

Get your free API key from: https://fdc.nal.usda.gov/api-guide.html

### 2. Service Availability

The integration includes automatic service availability detection. When the API key is not configured, the system gracefully degrades to manual food entry only.

## Usage Examples

### 1. Using the React Hook (useFDC)

```typescript
import { useFDC } from '@/lib/hooks/useFDC';

function MyComponent() {
  const {
    isLoading,
    error,
    searchResults,
    searchFoodsSimple,
    getFoodDetail
  } = useFDC();

  // Simple search
  const handleSearch = async () => {
    try {
      const results = await searchFoodsSimple('chicken breast', {
        pageSize: 10,
        dataType: ['Foundation', 'Branded']
      });
      console.log('Found foods:', results);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Get detailed food information
  const handleGetDetails = async (fdcId: number) => {
    try {
      const detail = await getFoodDetail(fdcId, 'abridged');
      console.log('Food details:', detail);
      // detail.foodItem contains the converted FoodItem ready for your app
    } catch (error) {
      console.error('Failed to get details:', error);
    }
  };

  return (
    <div>
      {/* Your UI here */}
    </div>
  );
}
```

### 2. Using the Search Component (FDCFoodSearch)

```typescript
import { FDCFoodSearch } from '@/components/food/FDCFoodSearch';
import type { FoodItem } from '@/lib/types';

function AddFoodPage() {
  const handleFoodSelect = (foodItem: Omit<FoodItem, 'id'>) => {
    console.log('Selected food:', foodItem);
    // Add to your food list, save to database, etc.
  };

  const handleFoodDetail = (fdcId: number) => {
    console.log('View details for FDC ID:', fdcId);
    // Navigate to detail view, open modal, etc.
  };

  return (
    <div className="p-6">
      <h1>Add New Food</h1>
      <FDCFoodSearch
        onFoodSelect={handleFoodSelect}
        onFoodDetail={handleFoodDetail}
        maxResults={20}
        allowMultiSelect={false}
      />
    </div>
  );
}
```

### 3. Direct API Calls

#### Search Foods
```typescript
// GET request with query parameters
const response = await fetch('/api/fdc/search?query=apple&pageSize=10', {
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  }
});

// POST request with full criteria
const response = await fetch('/api/fdc/search', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: 'quinoa',
    dataType: ['Foundation'],
    pageSize: 15,
    sortBy: 'lowercaseDescription.keyword',
    sortOrder: 'asc'
  })
});
```

#### Get Food Details
```typescript
// Single food
const response = await fetch('/api/fdc/foods/123456?format=abridged', {
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`
  }
});

// Multiple foods
const response = await fetch('/api/fdc/foods', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${await user.getIdToken()}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fdcIds: [123456, 789012],
    format: 'abridged'
  })
});
```

## Color Categorization Logic

The FDC integration automatically assigns color categories based on these criteria:

### Blue Foods (Unlimited)
- Vegetables (except starchy ones)
- Leafy greens and herbs
- Non-starchy fruits
- Lean proteins (chicken breast, fish, egg whites)
- Low-fat dairy

### Yellow Foods (Moderate)
- Whole grains and starches
- Legumes and beans
- Nuts and seeds
- Moderate-fat proteins
- Fruits with higher sugar content

### Red Foods (Limited)
- Processed and packaged foods
- High-fat/high-sugar items
- Refined grains
- Fried foods
- Desserts and sweets

## Search Filters and Options

### Data Types
- **Foundation**: Basic, scientifically researched foods
- **Branded**: Commercial food products with brand information
- **Survey**: Foods from dietary surveys (FNDDS)

### Sorting Options
- **lowercaseDescription.keyword**: Alphabetical by name (default)
- **dataType.keyword**: By food data type
- **publishedDate**: By publication date

### Search Tips
1. Use specific terms ("chicken breast" vs "chicken")
2. Try brand names for packaged foods
3. Use common food names rather than scientific terms
4. Include preparation methods ("grilled", "raw", "cooked")

## Error Handling

The integration includes comprehensive error handling:

### Service Unavailable (503)
- FDC API key not configured
- USDA service temporarily down
- Rate limits exceeded

### Authentication Required (401)
- User not logged in
- Invalid Firebase ID token

### Invalid Request (400)
- Missing required parameters
- Invalid FDC IDs
- Malformed search criteria

### Food Not Found (404)
- Invalid FDC ID
- Food removed from database

## Performance Considerations

### Rate Limits
- USDA FDC API has rate limits (typically 1000 requests/hour for free tier)
- Batch requests when possible (up to 20 foods per request)
- Implement caching for frequently accessed foods

### Response Times
- Search requests: ~1-3 seconds
- Detail requests: ~0.5-2 seconds
- Batch requests: ~2-5 seconds

### Optimization Tips
1. Use `pageSize` to limit results
2. Cache popular foods locally
3. Implement debounced search
4. Use `abridged` format unless full nutrition data needed

## Integration with Existing System

### Adding to Food Library
```typescript
const handleAddToLibrary = async (fdcFoodItem: FDCEnhancedFoodItem) => {
  // Get detailed information
  const detail = await getFoodDetail(fdcFoodItem.fdcId);
  
  // Add to user's food library
  const newFood = await foodService.createFood(detail.foodItem, user.uid);
  
  console.log('Added to library:', newFood);
};
```

### Integration with Plan Builder
```typescript
const handleAddToPlan = async (fdcFoodItem: FDCEnhancedFoodItem) => {
  // Convert to plan item
  const detail = await getFoodDetail(fdcFoodItem.fdcId);
  
  const planItem = {
    foodId: `fdc_${fdcFoodItem.fdcId}`, // Temporary ID
    food: detail.foodItem,
    quantity: 1,
    notes: ''
  };
  
  // Add to current plan
  setPlan(prev => ({
    ...prev,
    items: [...prev.items, planItem]
  }));
};
```

## Future Enhancements

### Planned Features
1. **AI-Enhanced Categorization**: Use Gemini AI to improve color assignments
2. **Local Caching**: Store frequently accessed foods in Firestore
3. **Nutrition Analysis**: Detailed nutrient breakdowns and comparisons
4. **Favorite Foods**: Save user's most-used FDC foods
5. **Offline Support**: Cache popular foods for offline use

### Configuration Options
1. **Custom Categories**: Allow coaches to override color assignments
2. **Search Preferences**: Save preferred filters and data types
3. **Regional Foods**: Filter by geographical regions
4. **Dietary Restrictions**: Filter foods based on dietary needs

## Troubleshooting

### Common Issues
1. **No search results**: Try broader terms or check spelling
2. **Slow responses**: Check network connection and API status
3. **Authentication errors**: Ensure user is logged in and tokens are valid
4. **Service unavailable**: Verify FDC_API_KEY is configured correctly

### Debug Information
Check browser console for detailed error messages and API response codes. The integration includes comprehensive logging for troubleshooting.
