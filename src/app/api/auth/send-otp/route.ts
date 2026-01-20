import { NextResponse } from 'next/server';

const BZ_API = 'https://behtarzindagi.in/Tractor_Api_Test/api';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Send OTP Request Body:', body);
    
    // Extract phone number - handle different field names
    const phoneNumber = body.Mobile || body.Number || body.number || body.phone || body.mobile || body.phoneNumber;
    const name = body.Name || body.name || 'User'; // Default name if not provided
    
    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required', message: 'Please provide a valid phone number' },
        { status: 400 }
      );
    }
    
    // Clean phone number (remove non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Validate phone number (should be 10 digits for Indian numbers)
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number', message: 'Phone number must be 10 digits' },
        { status: 400 }
      );
    }
    
    const url = `${BZ_API}/Home/CentraliseLogin`;
    console.log('Sending OTP to:', url, { Name: name, Number: cleanPhone });
    
    // Try POST first with JSON body
    const requestBody = {
      Name: name,
      Number: cleanPhone,
      FromSource: body.FromSource || 1,
      ToSource: body.ToSource || 0,
    };
    
    let response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://behtarzindagi.in/',
      },
      body: JSON.stringify(requestBody)
    });
    
    // If POST fails, try GET with query params (some APIs accept both)
    if (!response.ok) {
      console.log('POST failed, trying GET with query params');
      const queryParams = new URLSearchParams({
        Name: name,
        Number: cleanPhone,
        FromSource: String(requestBody.FromSource),
        ToSource: String(requestBody.ToSource),
      });
      
      response = await fetch(`${url}?${queryParams.toString()}`, {
        method: 'GET',
        headers: { 
          'Accept': 'application/json, text/plain, */*',
          'Referer': 'https://behtarzindagi.in/',
        },
      });
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to send OTP. Please try again.',
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
          message: 'Failed to send OTP. Please try again.',
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('Send OTP Response:', data);
    
    // Normalize response structure
    return NextResponse.json({
      success: data?.Status !== false && data?.Status !== 'false',
      message: data?.Message || data?.message || 'OTP sent successfully',
      data: data,
    });
  } catch (error) {
    console.error('Send OTP API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send OTP',
        message: 'Failed to send OTP. Please try again.',
      }, 
      { status: 500 }
    );
  }
}
