import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// GET product cancel status/reasons
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('OrderId') || searchParams.get('orderId');
    
    if (!orderId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'OrderId required',
          message: 'Order ID is required to fetch cancel status',
          data: null
        }, 
        { status: 400 }
      );
    }
    
    const url = `${BZ_API}/Home/ProductCancelStatus?OrderId=${orderId}`;
    console.log('Fetching product cancel status:', url);
    
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
          message: 'Failed to fetch product cancel status',
          data: null
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
          message: 'Failed to fetch product cancel status',
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
        message: 'Failed to fetch product cancel status',
        data: null
      }, 
      { status: 500 }
    );
  }
}
