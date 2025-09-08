import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

/**
 * Public API route for accessing food database
 * Used by client views to get food details for ingredients
 */
export async function GET(request: NextRequest) {
  try {
    // Get all foods from Firestore
    const foodsQuery = query(
      collection(db, 'foods'),
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
    console.error('❌ Error fetching foods:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch food database' },
      { status: 500 }
    );
  }
}
