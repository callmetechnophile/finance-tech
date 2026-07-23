interface OTPData {
  code: string;
  expiresAt: number;
  attempts: number;
}

// Global variable to persist in-memory store during Next.js hot reloads in dev mode
const globalForOTP = global as unknown as {
  otpStore: Map<string, OTPData>;
};

if (!globalForOTP.otpStore) {
  globalForOTP.otpStore = new Map<string, OTPData>();
}

export const otpStore = globalForOTP.otpStore;

export function saveOTP(phone: string, code: string): void {
  otpStore.set(phone, {
    code,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    attempts: 0,
  });
}

export function getOTP(phone: string): OTPData | undefined {
  return otpStore.get(phone);
}

export function incrementAttempts(phone: string): number {
  const data = otpStore.get(phone);
  if (data) {
    data.attempts += 1;
    otpStore.set(phone, data);
    return data.attempts;
  }
  return 0;
}

export function deleteOTP(phone: string): void {
  otpStore.delete(phone);
}
