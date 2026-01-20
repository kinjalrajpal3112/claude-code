import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// POST update order status after payment gateway
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Update order status request body:', body);
    
    const url = `${BZ_API}/Home/UpdateOrderStatusAfterPaymentGetway`;
    console.log('Updating order status:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://behtarzindagi.in/',
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
          message: 'Failed to update order status',
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
          message: 'Failed to update order status',
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
        error: error instanceof Error ? error.message : 'Failed to update order status',
        message: 'Failed to update order status. Please try again.',
      }, 
      { status: 500 }
    );
  }
}
