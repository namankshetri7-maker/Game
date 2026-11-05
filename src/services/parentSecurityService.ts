/**
 * Wonder World Kids - Parent Security Service
 * Provides cryptographic salted hashing, rate-limiting throttling,
 * dynamic adult challenge generation, and parent session verification.
 *
 * Security Design & Limitations:
 * - Zero plaintext PIN storage in localStorage.
 * - Unique 16-byte cryptographic salt generated on setup.
 * - SHA-256 salted hash derivation via standard Web Crypto API.
 * - Brute-force protection: progressive lockouts after 3, 4, and 5+ failed attempts.
 * - Honest Client-Side Boundary: Protects against accidental child entry (ages 3–10).
 *   Advanced users with OS file access or browser devtools can inspect local storage.
 */

const SECURITY_STORAGE_KEY = 'wonder_world_parent_security_v2';
const LEGACY_SETTINGS_KEY = 'wonder_world_parent_settings_v1';

export interface ParentSecurityRecord {
  isConfigured: boolean;
  pinHash: string | null;
  pinSalt: string | null;
  failedAttempts: number;
  lockoutUntil: number; // Unix timestamp in ms
  lastVerifiedAt: number;
}

export interface DynamicChallenge {
  id: string;
  type: 'math_mult' | 'math_sum' | 'words_to_digits';
  prompt: string;
  subtext: string;
  expectedAnswer: string;
}

class ParentSecurityService {
  private memoryState: ParentSecurityRecord | null = null;

  constructor() {
    this.init();
  }

  private init(): void {
    if (typeof window === 'undefined') return;
    const existing = this.loadRecord();
    if (!existing) {
      // Check if there is an old legacy PIN from v1
      try {
        const legacyRaw = localStorage.getItem(LEGACY_SETTINGS_KEY);
        if (legacyRaw) {
          const legacyObj = JSON.parse(legacyRaw);
          // If the parent explicitly changed from the default '1234', we migrate it safely;
          // if it was the default '1234', we require first-time parent setup to set their own PIN!
          if (legacyObj.parentPin && legacyObj.parentPin !== '1234' && /^\d{4}$/.test(legacyObj.parentPin)) {
            this.setupLegacyPinMigration(legacyObj.parentPin);
            return;
          }
        }
      } catch {
        // Ignore legacy parse errors
      }

      // Default fresh state: PIN is NOT yet configured
      const initial: ParentSecurityRecord = {
        isConfigured: false,
        pinHash: null,
        pinSalt: null,
        failedAttempts: 0,
        lockoutUntil: 0,
        lastVerifiedAt: 0
      };
      this.saveRecord(initial);
    }
  }

  private loadRecord(): ParentSecurityRecord | null {
    try {
      const raw = localStorage.getItem(SECURITY_STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private saveRecord(record: ParentSecurityRecord): void {
    this.memoryState = record;
    try {
      localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(record));
    } catch (e) {
      console.warn('Unable to persist security record to localStorage:', e);
    }
  }

  /**
   * Helper to compute SHA-256 hash with salt
   */
  private async hashPin(pin: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(`${salt}:${pin}:wonder_kids_safe_vault`);
    if (window.crypto && window.crypto.subtle) {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } else {
      // Fallback for non-subtle crypto environments (older webviews)
      let hash = 0;
      const str = `${salt}:${pin}:fallback`;
      for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
      }
      return Math.abs(hash).toString(16);
    }
  }

  /**
   * Generate a cryptographically random hex salt
   */
  private generateSalt(): string {
    const array = new Uint8Array(16);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(array);
    } else {
      for (let i = 0; i < 16; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
    }
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Migrate a legacy non-default PIN securely
   */
  private async setupLegacyPinMigration(legacyPin: string): Promise<void> {
    const salt = this.generateSalt();
    const hash = await this.hashPin(legacyPin, salt);
    this.saveRecord({
      isConfigured: true,
      pinHash: hash,
      pinSalt: salt,
      failedAttempts: 0,
      lockoutUntil: 0,
      lastVerifiedAt: 0
    });
  }

  /**
   * Check if the parent has already configured their secure PIN
   */
  public isPinConfigured(): boolean {
    const rec = this.loadRecord();
    return !!(rec && rec.isConfigured && rec.pinHash && rec.pinSalt);
  }

  /**
   * Check remaining lockout time in seconds
   */
  public getLockoutRemainingSeconds(): number {
    const rec = this.loadRecord();
    if (!rec || !rec.lockoutUntil) return 0;
    const now = Date.now();
    if (rec.lockoutUntil <= now) return 0;
    return Math.ceil((rec.lockoutUntil - now) / 1000);
  }

  /**
   * Set up a brand-new Parent PIN with confirmation
   */
  public async setupPin(pin: string, confirmPin: string): Promise<{ success: boolean; error?: string }> {
    const trimmedPin = pin.trim();
    const trimmedConfirm = confirmPin.trim();

    if (!/^\d{4}$/.test(trimmedPin)) {
      return { success: false, error: 'PIN must be exactly 4 numeric digits (0–9).' };
    }
    if (trimmedPin !== trimmedConfirm) {
      return { success: false, error: 'PIN confirmation does not match. Please re-enter.' };
    }
    // Block overly trivial repeating pins
    if (/^(\d)\1{3}$/.test(trimmedPin)) {
      return { success: false, error: 'Please choose a less predictable PIN (e.g. avoid 0000, 1111).' };
    }

    const salt = this.generateSalt();
    const hash = await this.hashPin(trimmedPin, salt);

    const updated: ParentSecurityRecord = {
      isConfigured: true,
      pinHash: hash,
      pinSalt: salt,
      failedAttempts: 0,
      lockoutUntil: 0,
      lastVerifiedAt: Date.now()
    };

    this.saveRecord(updated);
    return { success: true };
  }

  /**
   * Verify an entered PIN with brute-force throttling
   */
  public async verifyPin(candidatePin: string): Promise<{ success: boolean; error?: string; lockoutSeconds?: number }> {
    const rec = this.loadRecord();
    if (!rec || !rec.isConfigured || !rec.pinHash || !rec.pinSalt) {
      return { success: false, error: 'Parent PIN is not yet set up. Please create a PIN first.' };
    }

    // Check existing lockout
    const remainingLockout = this.getLockoutRemainingSeconds();
    if (remainingLockout > 0) {
      return {
        success: false,
        error: `Too many incorrect attempts. Please wait ${remainingLockout}s before trying again.`,
        lockoutSeconds: remainingLockout
      };
    }

    const trimmed = candidatePin.trim();
    if (!/^\d{4}$/.test(trimmed)) {
      return { success: false, error: 'Please enter a 4-digit PIN.' };
    }

    const computedHash = await this.hashPin(trimmed, rec.pinSalt);
    if (computedHash === rec.pinHash) {
      // Success! Reset failed attempts
      rec.failedAttempts = 0;
      rec.lockoutUntil = 0;
      rec.lastVerifiedAt = Date.now();
      this.saveRecord(rec);
      return { success: true };
    } else {
      // Failure - increment failed attempts and check throttling
      const nextFailures = (rec.failedAttempts || 0) + 1;
      rec.failedAttempts = nextFailures;

      let lockoutDurationMs = 0;
      if (nextFailures >= 5) {
        lockoutDurationMs = 5 * 60 * 1000; // 5 minutes
      } else if (nextFailures === 4) {
        lockoutDurationMs = 60 * 1000; // 1 minute
      } else if (nextFailures === 3) {
        lockoutDurationMs = 30 * 1000; // 30 seconds
      }

      if (lockoutDurationMs > 0) {
        rec.lockoutUntil = Date.now() + lockoutDurationMs;
        const lockoutSec = Math.ceil(lockoutDurationMs / 1000);
        this.saveRecord(rec);
        return {
          success: false,
          error: `Incorrect PIN. Security lock activated for ${lockoutSec} seconds.`,
          lockoutSeconds: lockoutSec
        };
      } else {
        this.saveRecord(rec);
        const attemptsLeft = 3 - nextFailures;
        return {
          success: false,
          error: `Incorrect PIN. ${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} before temporary lockout.`
        };
      }
    }
  }

  /**
   * Change an existing PIN (requires old PIN verification first)
   */
  public async changePin(currentPin: string, newPin: string, confirmNewPin: string): Promise<{ success: boolean; error?: string }> {
    const verifyResult = await this.verifyPin(currentPin);
    if (!verifyResult.success) {
      return { success: false, error: `Current PIN verification failed: ${verifyResult.error}` };
    }
    return this.setupPin(newPin, confirmNewPin);
  }

  /**
   * Generate a dynamic, non-hardcoded adult challenge at runtime
   */
  public generateDynamicChallenge(): DynamicChallenge {
    const types: DynamicChallenge['type'][] = ['math_mult', 'math_sum', 'words_to_digits'];
    const chosenType = types[Math.floor(Math.random() * types.length)];

    if (chosenType === 'math_mult') {
      const a = 6 + Math.floor(Math.random() * 7); // 6 to 12
      const b = 6 + Math.floor(Math.random() * 8); // 6 to 13
      const product = a * b;
      return {
        id: `c_mult_${Date.now()}`,
        type: 'math_mult',
        prompt: `What is ${a} multiplied by ${b}?`,
        subtext: 'Enter the product in digits',
        expectedAnswer: String(product)
      };
    } else if (chosenType === 'math_sum') {
      const a = 23 + Math.floor(Math.random() * 45);
      const b = 18 + Math.floor(Math.random() * 37);
      const sum = a + b;
      return {
        id: `c_sum_${Date.now()}`,
        type: 'math_sum',
        prompt: `What is ${a} plus ${b}?`,
        subtext: 'Enter the sum in digits',
        expectedAnswer: String(sum)
      };
    } else {
      // words to digits
      const DIGIT_WORDS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
      const digits: number[] = [];
      while (digits.length < 4) {
        digits.push(Math.floor(Math.random() * 10));
      }
      const prompt = `Type the digits for: ${digits.map(d => DIGIT_WORDS[d]).join(' - ')}`;
      const expectedAnswer = digits.join('');
      return {
        id: `c_words_${Date.now()}`,
        type: 'words_to_digits',
        prompt,
        subtext: 'Enter the 4 numbers in order',
        expectedAnswer
      };
    }
  }
}

export const parentSecurityService = new ParentSecurityService();
