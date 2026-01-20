import { NextResponse } from 'next/server';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

// GET handler - accepts query params but converts to POST body
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageIndex = parseInt(searchParams.get('PageIndex') || '1');
    const pageSize = parseInt(searchParams.get('PageSize') || '20');
    const hashTagId = parseInt(searchParams.get('HashTagId') || '0');
    
    const url = `${BZ_API}/BzCommonApi/GetBzShortVideosURLs`;
    console.log('Fetching videos:', url, { page: pageIndex, PageSize: pageSize, HashTagId: hashTagId });
    
    // API requires POST with JSON body
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://behtarzindagi.in/',
      },
      body: JSON.stringify({
        page: pageIndex,
        PageSize: pageSize,
        HashTagId: hashTagId,
      }),
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch videos',
          data: []
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
          message: 'Failed to fetch videos',
          data: []
        }, 
        { status: 500 }
      );
    }
    
    const data = await response.json();
    console.log('=== External API Response ===');
    console.log('Response structure:', JSON.stringify(data, null, 2));
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        message: 'Failed to fetch videos',
        data: []
      }, 
      { status: 500 }
    );
  }
}
