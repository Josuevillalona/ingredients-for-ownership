import { FoodColorBadge } from '@/components/ui/FoodColorBadge';
import { FOOD_CATEGORIES } from '@/lib/types';
import type { FoodItem } from '@/lib/types';

interface FoodCardProps {
  food: FoodItem;
  onEdit?: (food: FoodItem) => void;
  onDelete?: (food: FoodItem) => void;
  onSelect?: (food: FoodItem) => void;
  isSelectable?: boolean;
  isSelected?: boolean;
  showActions?: boolean;
}

export function FoodCard({ 
  food, 
  onEdit, 
  onDelete, 
  onSelect, 
  isSelectable = false,
  isSelected = false,
  showActions = true 
}: FoodCardProps) {
  const handleClick = () => {
    if (isSelectable && onSelect) {
      onSelect(food);
    }
  };

  const canEdit = !food.isGlobal;

  return (
    <div 
      className={`
        bg-white rounded-lg border p-4 transition-all duration-200
        ${isSelectable ? 'cursor-pointer hover:shadow-md hover:border-brand-gold' : ''}
        ${isSelected ? 'ring-2 ring-brand-gold border-brand-gold' : 'border-gray-200'}
      `}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">{food.name}</h3>
          <FoodColorBadge category={food.category}>
            {FOOD_CATEGORIES[food.category].name}
          </FoodColorBadge>
        </div>
        
        {showActions && canEdit && (
          <div className="flex gap-2 ml-3">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(food);
                }}
                className="text-sm text-brand-gold hover:text-brand-dark transition-colors"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(food);
                }}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>

      {food.description && (
        <p className="text-sm text-gray-600 mb-2">{food.description}</p>
      )}

      {food.servingSize && (
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Serving size:</span> {food.servingSize}
        </p>
      )}

      {food.portionGuidelines && (
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium">Guidelines:</span> {food.portionGuidelines}
        </p>
      )}

      {food.nutritionalInfo && Object.keys(food.nutritionalInfo).length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            {food.nutritionalInfo.calories && (
              <div><span className="font-medium">Calories:</span> {food.nutritionalInfo.calories}</div>
            )}
            {food.nutritionalInfo.protein && (
              <div><span className="font-medium">Protein:</span> {food.nutritionalInfo.protein}g</div>
            )}
            {food.nutritionalInfo.carbs && (
              <div><span className="font-medium">Carbs:</span> {food.nutritionalInfo.carbs}g</div>
            )}
            {food.nutritionalInfo.fat && (
              <div><span className="font-medium">Fat:</span> {food.nutritionalInfo.fat}g</div>
            )}
          </div>
        </div>
      )}

      {food.tags.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap gap-1">
            {food.tags.map((tag, index) => (
              <span 
                key={index}
                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {food.isGlobal && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
            Global Food
          </span>
        </div>
      )}
    </div>
  );
}
