import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const FARMER_API = 'https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc/api';

// GET state, district, block, village data
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('StateId') || searchParams.get('stateId');
    const districtId = searchParams.get('DistrictId') || searchParams.get('districtId');
    const blockId = searchParams.get('BlockId') || searchParams.get('blockId');
    
    // Build query params
    const params = new URLSearchParams();
    if (stateId) params.append('StateId', stateId);
    if (districtId) params.append('DistrictId', districtId);
    if (blockId) params.append('BlockId', blockId);
    
    const url = `${FARMER_API}/GetStateDistrictBlockVilage${params.toString() ? '?' + params.toString() : ''}`;
    console.log('Fetching location data:', url);
    
    const response = await fetch(url, {
      headers: { 
        'Accept': 'application/json, text/plain, */*',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch location data',
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
          message: 'Failed to fetch location data',
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
        message: 'Failed to fetch location data',
        data: []
      }, 
      { status: 500 }
    );
  }
}
