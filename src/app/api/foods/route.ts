import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Public API route for accessing global food database
 * Used by client views to get food details for ingredients
 * Must match the same data source used by dashboard plan creation
 */
export async function GET(request: NextRequest) {
  try {
    // Get global foods from Firestore (same filter as dashboard)
    const foodsQuery = query(
      collection(db, 'foods'),
      where('isGlobal', '==', true),
      orderBy('name', 'asc')
    );
    
    const querySnapshot = await getDocs(foodsQuery);
    
    const foods = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ 
      foods,
      count: foods.length 
    });

  } catch (error) {
    console.error('❌ Error fetching global foods:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch food database' },
      { status: 500 }
    );
  }
}
