'use client';

import { useState } from 'react';
import { foodService } from '@/lib/firebase/foods';
import { huggingFaceCategorization } from '@/lib/services/huggingface-categorization';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Button } from '@/components/ui/Button';

export default function AdminCategorizePage() {
  const [status, setStatus] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const categorizeExistingFoods = async () => {
    setProcessing(true);
    setStatus(' Starting categorization...');
    setResults([]);
    
    try {
      // Get all foods
      const foods = await foodService.getGlobalFoods();
      setStatus(` Found ${foods.length} foods to process`);
      
      let updated = 0;
      let skipped = 0;
      const logs: string[] = [];
      
      for (const food of foods) {
        // Skip if already has category
        if (food.category) {
          const msg = ` ${food.name} - already categorized as ${food.category}`;
          console.log(msg);
          logs.push(msg);
          skipped++;
          continue;
        }
        
        try {
          const msg1 = ` Categorizing: ${food.name}`;
          console.log(msg1);
          logs.push(msg1);
          setResults([...logs]);
          
          // Categorize the food
          const result = await huggingFaceCategorization.categorizeFood(food);
          
          // Update the food document
          const foodRef = doc(db, 'foods', food.id);
          await updateDoc(foodRef, {
            category: result.category,
            categoryConfidence: result.confidence,
            categoryMethod: result.method,
            categorizedAt: Timestamp.now(),
            lastUpdated: Timestamp.now()
          });
          
          const msg2 = ` ${food.name}  ${result.category} (${(result.confidence * 100).toFixed(1)}%)`;
          console.log(msg2);
          logs.push(msg2);
          setResults([...logs]);
          updated++;
          
        } catch (error) {
          const msg = ` Failed to categorize ${food.name}: ${error}`;
          console.error(msg);
          logs.push(msg);
          setResults([...logs]);
        }
      }
      
      const finalMsg = ` COMPLETE! Updated ${updated} foods, skipped ${skipped} already categorized.`;
      setStatus(finalMsg);
      logs.push('');
      logs.push(finalMsg);
      logs.push(' Go to plan creation page to see the results!');
      setResults(logs);
      
    } catch (error) {
      const errorMsg = ` Error: ${error}`;
      console.error(errorMsg);
      setStatus(errorMsg);
      setResults([errorMsg]);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
             Admin: Categorize Existing Foods
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 mb-4">
              This tool will categorize all existing foods that don&apos;t have a category assigned.
              New foods are automatically categorized, but this fixes older foods.
            </p>
            
            <Button
              onClick={categorizeExistingFoods}
              disabled={processing}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700"
            >
              {processing ? ' Processing...' : ' Categorize All Foods'}
            </Button>
          </div>

          {status && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
              <p className="font-semibold text-blue-900">{status}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded p-4 max-h-96 overflow-y-auto">
              <h2 className="font-semibold text-gray-900 mb-2">Processing Log:</h2>
              <div className="font-mono text-sm space-y-1">
                {results.map((result, index) => (
                  <div 
                    key={index}
                    className={
                      result.startsWith('') ? 'text-green-600' :
                      result.startsWith('') ? 'text-red-600' :
                      result.startsWith('') ? 'text-yellow-600' :
                      result.startsWith('') ? 'text-green-700 font-bold' :
                      'text-gray-600'
                    }
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
