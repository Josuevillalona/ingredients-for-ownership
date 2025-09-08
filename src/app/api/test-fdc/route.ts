/**
 * Simple FDC API Test Route (No Auth Required)
 * Quick test to verify FDC API key is working
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const FDC_API_KEY = process.env.FDC_API_KEY;
    
    if (!FDC_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'FDC_API_KEY not configured',
        instructions: 'Add FDC_API_KEY to your .env.local file'
      });
    }

    // Test detailed food info with nutrition data
    const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods?api_key=${FDC_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fdcIds: [171477], // Chicken, roasted
        format: 'abridged',
        nutrients: [
          208, // Energy (calories)
          203, // Protein
          204, // Total lipid (fat)
          205, // Carbohydrate, by difference
          291, // Fiber, total dietary
          269, // Sugars, total including NLEA
          307, // Sodium
        ]
      })
    });

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: `FDC API Error: ${response.status} ${response.statusText}`,
        details: 'Check if your API key is valid'
      });
    }

    const data = await response.json();
    
    const firstFood = data[0] || null;
    
    return NextResponse.json({
      success: true,
      message: 'FDC API nutrition test successful!',
      data: {
        foodCount: data.length,
        firstFood: firstFood,
        nutrients: firstFood?.foodNutrients || [],
        sampleNutrient: firstFood?.foodNutrients?.[0] || null,
        fullResponse: data
      }
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Network or API error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
