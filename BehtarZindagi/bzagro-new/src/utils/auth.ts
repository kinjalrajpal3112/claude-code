// Authentication utility functions

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for access token in localStorage
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return !!token;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken') || localStorage.getItem('token');
}

export function getUserData(): any {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem('userData');
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
  return null;
}

export function getFarmerId(): number | null {
  const userData = getUserData();
  return userData?.id || userData?.farmerId || null;
}

export function getMobileNumber(): string | null {
  const userData = getUserData();
  if (!userData) {
    console.warn('No user data found in localStorage');
    return null;
  }
  
  // Try all possible field names
  const mobile = userData?.mobile 
              || userData?.phone 
              || userData?.mobileNumber 
              || userData?.Mobile
              || userData?.Number
              || null;
  
  if (mobile) {
    // Ensure it's a clean string (remove any non-digits, but keep as string)
    const cleanMobile = String(mobile).replace(/\D/g, '');
    console.log('Retrieved mobile number:', cleanMobile);
    return cleanMobile;
  }
  
  console.warn('Mobile number not found in userData:', Object.keys(userData));
  return null;
}

export function setAuthData(token: string, userData: any) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('accessToken', token);
  localStorage.setItem('userData', JSON.stringify(userData));
}

export function clearAuthData() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
}
