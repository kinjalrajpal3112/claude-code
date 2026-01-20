import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

export async function GET() {
  try {
    const url = `${BZ_API}/Category/Get_MainCategory`;
    console.log('Fetching categories:', url);
    
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
          message: 'Failed to fetch categories',
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
          message: 'Failed to fetch categories',
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
        message: 'Failed to fetch categories',
        data: []
      }, 
      { status: 500 }
    );
  }
}
