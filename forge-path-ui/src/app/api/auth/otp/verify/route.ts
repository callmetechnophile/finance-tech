import { NextResponse } from "next/server";
import { getOTP, incrementAttempts, deleteOTP } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const { phone, code } = await request.json();

    if (!phone || !code || typeof phone !== "string" || typeof code !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number and code are required." },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim().replace(/[\s-]/g, "");
    const fullPhone = cleanPhone.startsWith("+")
      ? cleanPhone
      : `+91${cleanPhone.replace(/^0+/, "")}`;
    const cleanCode = code.trim();

    // Check store for both cleanPhone and fullPhone
    const otpData = getOTP(cleanPhone) || getOTP(fullPhone);

    if (!otpData) {
      return NextResponse.json(
        { success: false, error: "No active verification code found for this phone number." },
        { status: 400 }
      );
    }

    // Check expiry
    if (Date.now() > otpData.expiresAt) {
      deleteOTP(cleanPhone);
      deleteOTP(fullPhone);
      return NextResponse.json(
        { success: false, error: "Verification code expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check attempts limit (3 max)
    if (otpData.attempts >= 3) {
      deleteOTP(cleanPhone);
      deleteOTP(fullPhone);
      return NextResponse.json(
        { success: false, error: "OTP limit exceeded (3 attempts max). Please request a new code.", locked: true },
        { status: 400 }
      );
    }

    // Verify Code
    if (otpData.code === cleanCode) {
      // Success! Clear OTP
      deleteOTP(cleanPhone);
      deleteOTP(fullPhone);

      // Return user and company session context
      return NextResponse.json({
        success: true,
        user: {
          id: `usr-phone-${cleanPhone.slice(-4)}`,
          email: `${cleanPhone}@forge-path.internal`,
          name: `User ${cleanPhone.slice(-4)}`,
          role: "admin",
          company_id: "apex-manufacturing-uuid",
        },
        company: {
          id: "apex-manufacturing-uuid",
          name: "Apex Manufacturing Inc.",
          industry: "CNC & Fabrication",
          currency: "INR",
        },
        token: `mock-jwt-phone-${Math.random().toString(36).substring(7)}`,
      });
    } else {
      // Increment attempt counter
      const currentAttempts = Math.max(incrementAttempts(cleanPhone), incrementAttempts(fullPhone));

      if (currentAttempts >= 3) {
        deleteOTP(cleanPhone); // lock/invalidate the code completely
        deleteOTP(fullPhone);
        return NextResponse.json(
          {
            success: false,
            error: "Incorrect code. OTP limit exceeded (3 attempts max). Please request a new code.",
            attempts: currentAttempts,
            locked: true,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Incorrect verification code.`,
          attempts: currentAttempts,
          remaining: 3 - currentAttempts,
          locked: false,
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("Error in OTP verify route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
