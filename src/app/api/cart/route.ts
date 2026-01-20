import { NextResponse } from 'next/server';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// GET cart items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    // API expects MobileNo (mobile number), not FarmerId
    const mobileNo = searchParams.get('MobileNo') || searchParams.get('mobileNo') || searchParams.get('FarmerId') || searchParams.get('farmerId');
    
    if (!mobileNo) {
      return NextResponse.json(
        { success: false, error: 'MobileNo required', message: 'Mobile number is required to fetch cart items' },
        { status: 400 }
      );
    }
    
    // Clean mobile number (remove non-digits) - keep as string for query param
    const cleanMobileNo = mobileNo.replace(/\D/g, '');
    
    // API might expect MobileNo as integer in query, try both formats
    const url = `${BZ_API}/BzWebsite/GetCartItems?MobileNo=${cleanMobileNo}`;
    console.log('Getting cart items:', url);
    console.log('Mobile number format:', { original: mobileNo, cleaned: cleanMobileNo, asInt: parseInt(cleanMobileNo) });
    
    const response = await fetch(url, {
      method: 'GET',
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
          message: 'Failed to fetch cart items',
          CartItems: []
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
          message: 'Failed to fetch cart items',
          CartItems: []
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('=== Cart Items API Response ===');
    console.log('Full response:', JSON.stringify(data, null, 2));
    console.log('CartItems field:', data?.CartItems);
    console.log('Response keys:', Object.keys(data || {}));
    return NextResponse.json(data);
  } catch (error) {
    console.error('Get Cart Items API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch cart items',
        message: 'Failed to fetch cart items',
        CartItems: []
      }, 
      { status: 500 }
    );
  }
}

// POST add/remove to/from cart
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Cart operation request body:', body);
    
    // Validate required fields
    if (!body.MobileNo && !body.mobileNo) {
      return NextResponse.json(
        { success: false, error: 'MobileNo required', message: 'Mobile number is required' },
        { status: 400 }
      );
    }
    
    if (!body.BzProductId && !body.bzProductId) {
      return NextResponse.json(
        { success: false, error: 'BzProductId required', message: 'Product ID is required' },
        { status: 400 }
      );
    }
    
    if (!body.InType) {
      return NextResponse.json(
        { success: false, error: 'InType required', message: 'InType (Add/Remove) is required' },
        { status: 400 }
      );
    }
    
    // Clean and format request body
    const cleanMobileNo = String(body.MobileNo || body.mobileNo).replace(/\D/g, '');
    const mobileNoInt = parseInt(cleanMobileNo);
    
    // API expects MobileNo as integer based on backend DTO
    const requestBody: any = {
      InType: body.InType, // "Add" or "Remove" - must be exact string
      MobileNo: mobileNoInt, // Must be integer
      BzProductId: parseInt(body.BzProductId || body.bzProductId),
    };
    
    // Quantity is only needed for Add operations
    if (body.InType === 'Add' && body.Quantity) {
      requestBody.Quantity = parseInt(body.Quantity);
    }
    
    console.log('=== Add to Cart Request ===');
    console.log('Original body:', body);
    console.log('Cleaned mobile:', cleanMobileNo);
    console.log('Mobile as integer:', mobileNoInt);
    console.log('Formatted request body:', JSON.stringify(requestBody, null, 2));
    
    const url = `${BZ_API}/BzWebsite/AddToCartItems`;
    console.log('Cart operation:', url, requestBody);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://behtarzindagi.in/',
      },
      body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: `Failed to ${requestBody.InType.toLowerCase()} item from cart`,
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
          message: `Failed to ${requestBody.InType.toLowerCase()} item from cart`,
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('=== Add to Cart API Response ===');
    console.log('Full response:', JSON.stringify(data, null, 2));
    console.log('Response keys:', Object.keys(data || {}));
    console.log('Success indicators:', {
      hasStatus: !!data?.Status,
      Status: data?.Status,
      hasSuccess: !!data?.success,
      success: data?.success,
      hasMessage: !!data?.Message || !!data?.message,
      message: data?.Message || data?.message,
    });
    
    // Normalize response - check if operation was actually successful
    const isSuccess = data?.Status === true 
                  || data?.Status === 'true'
                  || data?.success === true
                  || (data?.Status !== false && data?.Status !== 'false' && !data?.error);
    
    return NextResponse.json({
      ...data,
      success: isSuccess,
      _normalized: true, // Flag to indicate we normalized the response
    });
  } catch (error) {
    console.error('Cart Operation API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update cart',
        message: 'Failed to update cart. Please try again.',
      }, 
      { status: 500 }
    );
  }
}
