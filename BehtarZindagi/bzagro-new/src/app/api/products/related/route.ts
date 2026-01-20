import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// GET related products
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('PackageId') || searchParams.get('packageId');
    const categoryId = searchParams.get('CategoryId') || searchParams.get('categoryId');
    
    if (!packageId && !categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'PackageId or CategoryId required',
          message: 'Product ID or Category ID is required to fetch related products',
          data: []
        }, 
        { status: 400 }
      );
    }
    
    // Build query params
    const params = new URLSearchParams();
    if (packageId) params.append('PackageId', packageId);
    if (categoryId) params.append('CategoryId', categoryId);
    
    const url = `${BZ_API}/Home/GetRelatedProducts?${params.toString()}`;
    console.log('Fetching related products:', url);
    
    const response = await fetch(url, {
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://behtarzindagi.in/',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch related products',
          data: []
        }, 
        { status: response.status }
      );
    }
    
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('API returned non-JSON response:', text.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: 'External API returned non-JSON response',
          message: 'Failed to fetch related products',
          data: []
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
        message: 'Failed to fetch related products',
        data: []
      }, 
      { status: 500 }
    );
  }
}
