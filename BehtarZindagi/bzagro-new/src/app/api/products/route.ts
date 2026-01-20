import { NextResponse } from 'next/server';

// Route segment config
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const BZ_API = 'https://behtarzindagi.in/BZFarmerApp_Live/api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageIndex = searchParams.get('PageIndex') || '1';
    const pageSize = searchParams.get('PageSize') || '20';
    
    const url = `${BZ_API}/Home/GetAllProducts?PageIndex=${pageIndex}&PageSize=${pageSize}`;
    console.log('Fetching products:', url);
    
    const response = await fetch(url, {
      headers: { 
        'Accept': 'application/json, text/plain, */*',
        'Referer': 'https://behtarzindagi.in/',
      },
    });
    
    // Check if response is OK
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API returned status ${response.status}:`, errorText.substring(0, 200));
      return NextResponse.json(
        { 
          success: false, 
          error: `External API returned status ${response.status}`,
          message: 'Failed to fetch products',
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
          message: 'Failed to fetch products',
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
    console.log('=== Products API Response Sample ===');
    // Log first product structure to see what fields are available
    const firstProduct = data?.ProductsApiReponse?.Product?.[0] || data?.Product?.[0] || data?.data?.ProductsApiReponse?.Product?.[0];
    if (firstProduct) {
      console.log('First product structure:', JSON.stringify(firstProduct, null, 2));
      console.log('Product ID fields:', {
        PackageID: firstProduct.PackageID,
        PackageId: firstProduct.PackageId,
        BzProductId: firstProduct.BzProductId,
        ProductId: firstProduct.ProductId,
        ProductID: firstProduct.ProductID,
      });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch',
        message: 'Failed to fetch products',
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
