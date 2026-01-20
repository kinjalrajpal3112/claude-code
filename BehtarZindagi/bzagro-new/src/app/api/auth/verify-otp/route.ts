import { NextResponse } from 'next/server';

const BZ_API = 'https://behtarzindagi.in/Tractor_Api_Test/api';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Verify OTP Request Body:', body);
    
    // Extract data - handle different field names
    const phoneNumber = body.Mobile || body.Number || body.number || body.phone || body.mobile || body.phoneNumber;
    const otp = body.OTP || body.Otp || body.otp || body.code;
    const name = body.Name || body.name || 'User';
    
    if (!phoneNumber || !otp) {
      return NextResponse.json(
        { success: false, error: 'Phone number and OTP are required', message: 'Please provide phone number and OTP' },
        { status: 400 }
      );
    }
    
    // Clean phone number and OTP
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const cleanOtp = otp.replace(/\D/g, '');
    
    // Validate
    if (cleanPhone.length !== 10) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number', message: 'Phone number must be 10 digits' },
        { status: 400 }
      );
    }
    
    if (cleanOtp.length < 4 || cleanOtp.length > 6) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP', message: 'OTP must be 4-6 digits' },
        { status: 400 }
      );
    }
    
    const url = `${BZ_API}/Home/CentraliseVerifyLogin`;
    console.log('Verifying OTP at:', url, { Name: name, Number: cleanPhone, OTP: cleanOtp });
    
    // Try POST first with JSON body
    const requestBody = {
      Name: name,
      Number: cleanPhone,
      OTP: cleanOtp,
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
    
    // If POST fails, try GET with query params
    if (!response.ok) {
      console.log('POST failed, trying GET with query params');
      const queryParams = new URLSearchParams({
        Name: name,
        Number: cleanPhone,
        OTP: cleanOtp,
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
          message: 'Failed to verify OTP. Please check your OTP and try again.',
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
          message: 'Failed to verify OTP. Please try again.',
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('Verify OTP Response:', data);
    
    // Extract user details and tokens from response
    const userDetails = data?.ds?.UserDetails?.[0] 
                     || data?.UserDetails?.[0] 
                     || data?.userDetails?.[0]
                     || data?.data?.userDetails?.[0]
                     || {};
    
    // Normalize response structure
    const isSuccess = data?.Status !== false 
                   && data?.Status !== 'false' 
                   && data?.LoginStatus !== 'error'
                   && (data?.ds?.UserDetails?.length > 0 || userDetails?.UserId);
    
    return NextResponse.json({
      success: isSuccess,
      message: isSuccess ? 'OTP verified successfully' : (data?.Message || data?.message || 'Invalid OTP'),
      data: {
        user: {
          UserId: userDetails?.UserId || 0,
          FirstName: userDetails?.FirstName || name,
          LastName: userDetails?.LastName || '',
          Mobile: cleanPhone,
          Email: userDetails?.Email || `${cleanPhone}@phone.local`,
        },
        tokens: {
          accessToken: data?.accessToken || data?.token || 'temp-token', // API might not return token directly
        },
        rawResponse: data,
      },
    });
  } catch (error) {
    console.error('Verify OTP API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to verify OTP',
        message: 'Failed to verify OTP. Please try again.',
      }, 
      { status: 500 }
    );
  }
}
