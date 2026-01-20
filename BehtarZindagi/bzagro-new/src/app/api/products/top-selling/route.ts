import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// NO GetTopSellingProductsWeb API exists!
// Using GetAllProducts with PageSize limit instead
const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageSize = searchParams.get('PageSize') || '12';
    
    // Use GetAllProducts as Top Selling (no separate API exists)
    const url = `${BZ_API}/Home/GetAllProducts?PageIndex=1&PageSize=${pageSize}`;
    
    console.log('Fetching top products:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://behtarzindagi.in/',
      },
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch top selling products'
        }, 
        { status: response.status }
      );
    }
    
    // Check content type before parsing
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('API returned non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: 'External API returned non-JSON response',
          message: 'Failed to fetch top selling products',
          data: {
            ProductsApiReponse: {
              Product: []
            }
          }
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        message: 'Failed to fetch top selling products',
        data: {
          ProductsApiReponse: {
            Product: []
          }
        }
      }, 
      { status: 500 }
    );
  }
}
