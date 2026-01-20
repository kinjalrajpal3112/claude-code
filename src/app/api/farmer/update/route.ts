import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const FARMER_API = 'https://behtarzindagi.in/bz_FarmerApp/ProductDetail.svc/api';

// POST update farmer data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Update farmer data request body:', body);
    
    const url = `${FARMER_API}/UpdateFarmerData`;
    console.log('Updating farmer data:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to update farmer data',
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
          message: 'Failed to update farmer data',
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
        error: error instanceof Error ? error.message : 'Failed to update farmer data',
        message: 'Failed to update farmer data. Please try again.',
      }, 
      { status: 500 }
    );
  }
}
