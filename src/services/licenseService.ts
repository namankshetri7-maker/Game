/**
 * Gumroad License Key Verification Service for Wonder World Kids Learning
 * Integrates directly with Gumroad's Official License Verification API
 * (https://api.gumroad.com/v2/licenses/verify)
 * 
 * Product: Wonder World Kids Learning
 * Permalink: wvpisb
 */

export interface LicenseVerificationResult {
  success: boolean;
  message?: string;
  licenseKey?: string;
  buyerEmail?: string;
  buyerName?: string;
  purchaseDate?: string;
  isRefunded?: boolean;
}

const GUMROAD_PRODUCT_ID = '3AhcEFEj3-aHkZ0hQA0drA==';
const GUMROAD_PERMALINK = 'wvpisb';
const STORAGE_KEY_PURCHASED = 'wwk_purchased';
const STORAGE_KEY_LICENSE = 'wwk_license';
const STORAGE_KEY_EMAIL = 'wwk_license_email';
const STORAGE_KEY_DATE = 'wwk_license_date';

// Authorized offline master passes
export const MASTER_LIFETIME_KEYS = [
  'WWK-ETSY-FAMILY-ACCESS',
  'WWK-ETSY-XCZJDBDJSJHSH-ACCESS',
  'WWK-ETSY-2026',
  'WWK-TEST-PASS',
  'WWK-DEV-PASS',
  'WWK-LIFETIME-PASS'
];

async function verifyDirectWithGumroad(
  rawKey: string,
  target: { productId?: string; productPermalink?: string }
): Promise<any> {
  const formData = new URLSearchParams();
  if (target.productId) {
    formData.append('product_id', target.productId);
  } else if (target.productPermalink) {
    formData.append('product_permalink', target.productPermalink);
  }
  formData.append('license_key', rawKey);
  formData.append('increment_uses_count', 'false');

  const directResponse = await fetch('https://api.gumroad.com/v2/licenses/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  });
  return directResponse.json();
}

export const licenseService = {
  /**
   * Check if the current device/browser already has an active, verified license
   */
  isUnlocked(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY_PURCHASED) === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Get details about the currently stored license
   */
  getStoredLicense(): { isUnlocked: boolean; licenseKey: string; buyerEmail: string; date: string } {
    try {
      const isUnlocked = localStorage.getItem(STORAGE_KEY_PURCHASED) === 'true';
      const licenseKey = localStorage.getItem(STORAGE_KEY_LICENSE) || '';
      const buyerEmail = localStorage.getItem(STORAGE_KEY_EMAIL) || '';
      const date = localStorage.getItem(STORAGE_KEY_DATE) || '';
      return { isUnlocked, licenseKey, buyerEmail, date };
    } catch {
      return { isUnlocked: false, licenseKey: '', buyerEmail: '', date: '' };
    }
  },

  /**
   * Save and activate verified license locally
   */
  saveLicense(licenseKey: string, buyerEmail: string = '', purchaseDate: string = ''): void {
    try {
      const trimmed = licenseKey.trim();
      const normalized = MASTER_LIFETIME_KEYS.includes(trimmed.toUpperCase())
        ? trimmed.toUpperCase()
        : trimmed;
      localStorage.setItem(STORAGE_KEY_PURCHASED, 'true');
      localStorage.setItem(STORAGE_KEY_LICENSE, normalized);
      localStorage.setItem('wwk_view_preference', 'app_only');
      if (buyerEmail) localStorage.setItem(STORAGE_KEY_EMAIL, buyerEmail);
      if (purchaseDate) localStorage.setItem(STORAGE_KEY_DATE, purchaseDate);
    } catch (e) {
      console.error('Failed to save license to localStorage:', e);
    }
  },

  /**
   * Revoke license locally (e.g. for reset or testing)
   */
  revokeLicense(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_PURCHASED);
      localStorage.removeItem(STORAGE_KEY_LICENSE);
      localStorage.removeItem(STORAGE_KEY_EMAIL);
      localStorage.removeItem(STORAGE_KEY_DATE);
      localStorage.removeItem('wwk_view_preference');
    } catch (e) {
      console.error('Failed to clear license:', e);
    }
  },

  /**
   * Verify license key with Gumroad API (with server proxy and client fallback)
   */
  async verifyGumroadLicense(licenseKeyInput: string): Promise<LicenseVerificationResult> {
    const rawKey = licenseKeyInput.trim();
    if (!rawKey) {
      return { success: false, message: 'Please enter a valid license key from your Gumroad receipt.' };
    }

    const cleanKey = rawKey.toUpperCase();

    // 1. Check exact authorized offline master passes
    if (MASTER_LIFETIME_KEYS.includes(cleanKey)) {
      this.saveLicense(cleanKey, 'family-license@wonderworldkidslearning.space', new Date().toISOString());
      return {
        success: true,
        licenseKey: cleanKey,
        buyerEmail: 'family-license@wonderworldkidslearning.space',
        buyerName: 'Lifetime Family Member',
        purchaseDate: new Date().toLocaleDateString()
      };
    }

    // 2. Call Gumroad Verification API via backend proxy or directly
    try {
      // First try local Express proxy endpoint if running (returns application/json).
      // On static hosts (e.g. Cloudflare Pages with SPA _redirects), /api/* returns 200 text/html.
      let data: any = null;
      try {
        const proxyResponse = await fetch('/api/verify-license', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            license_key: rawKey,
            product_id: GUMROAD_PRODUCT_ID,
            product_permalink: GUMROAD_PERMALINK
          })
        });
        const contentType = proxyResponse.headers?.get('content-type') || '';
        if (contentType.toLowerCase().includes('application/json')) {
          const parsed = await proxyResponse.json();
          if (parsed && typeof parsed.success === 'boolean' && (proxyResponse.status < 500 || parsed.purchase)) {
            data = parsed;
          }
        }
      } catch {
        data = null;
      }

      if (!data) {
        // Direct call to Gumroad's CORS-enabled API (try product_id first, then permalink fallback)
        data = await verifyDirectWithGumroad(rawKey, { productId: GUMROAD_PRODUCT_ID });
        if (!data?.success) {
          const fallbackData = await verifyDirectWithGumroad(rawKey, { productPermalink: GUMROAD_PERMALINK });
          if (fallbackData?.success) {
            data = fallbackData;
          }
        }
      }

      if (data && data.success === true) {
        const purchase = data.purchase || {};
        
        // Check if purchase was refunded or disputed
        if (purchase.refunded || purchase.disputed || purchase.chargebacked) {
          return {
            success: false,
            message: 'This license key has been refunded or cancelled.'
          };
        }

        const buyerEmail = purchase.email || '';
        const purchaseDate = purchase.created_at ? new Date(purchase.created_at).toLocaleDateString() : new Date().toLocaleDateString();

        // Save valid license in local storage
        this.saveLicense(rawKey, buyerEmail, purchaseDate);

        return {
          success: true,
          licenseKey: rawKey,
          buyerEmail,
          buyerName: purchase.buyer_name || 'Valued Parent',
          purchaseDate
        };
      } else {
        return {
          success: false,
          message: data?.message || 'License key not recognized for Wonder World Kids. Please check your key from your PDF.'
        };
      }
    } catch (err) {
      console.error('License verification request error:', err);
      return {
        success: false,
        message: 'Could not connect to license verification server. Please verify your internet connection.'
      };
    }
  }
};
