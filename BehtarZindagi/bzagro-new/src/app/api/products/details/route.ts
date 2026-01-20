import { NextResponse } from 'next/server';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// GET handler for product details
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const packageId = searchParams.get('PackageId') || searchParams.get('packageId');
    
    if (!packageId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'PackageId required',
          data: null
        }, 
        { status: 400 }
      );
    }
    
    // API endpoint is case-sensitive: /home/GetBZProductDetails (not /Home/)
    const url = `${BZ_API}/home/GetBZProductDetails?PackageId=${packageId}`;
    console.log('Fetching product details:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://behtarzindagi.in/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      cache: 'no-store',
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch product details',
          data: null
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
          message: 'Failed to fetch product details',
          data: null
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
        message: 'Failed to fetch product details',
        data: null
      }, 
      { status: 500 }
    );
  }
}
