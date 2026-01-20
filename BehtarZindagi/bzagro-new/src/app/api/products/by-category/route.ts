import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('CategoryId') || searchParams.get('categoryId');
    const pageIndex = searchParams.get('PageIndex') || '1';
    const pageSize = searchParams.get('PageSize') || '12';
    
    if (!categoryId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'CategoryId required',
          data: {
            ProductsApiReponse: {
              Product: []
            }
          }
        }, 
        { status: 400 }
      );
    }
    
    // POST request with JSON body as per API spec
    const url = `${BZ_API}/Home/GetAllProductsByCatogory`;
    console.log('Fetching products by category:', url, { categoryId, pageIndex, pageSize });
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
        'Referer': 'https://behtarzindagi.in/',
      },
      body: JSON.stringify({
        PageIndex: parseInt(pageIndex),
        PageSize: parseInt(pageSize),
        CategoryId: categoryId
      })
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch products by category',
          data: {
            ProductsApiReponse: {
              Product: []
            }
          }
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
          message: 'Failed to fetch products by category',
          data: {
            ProductsApiReponse: {
              Product: []
            }
          }
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
        message: 'Failed to fetch products by category',
        data: {
          ProductsApiReponse: {
            Product: []
          }
        }
      }, 
      { status: 500 }
    );
  }
}
