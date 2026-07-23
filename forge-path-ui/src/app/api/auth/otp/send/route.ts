import { NextResponse } from "next/server";
import { saveOTP } from "@/lib/otp-store";

export async function POST(request: Request) {
  try {
    const { phone } = await request.json();

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Phone number is required." },
        { status: 400 }
      );
    }

    // Clean phone number (remove spaces, hyphens, etc.)
    const cleanPhone = phone.trim().replace(/[\s-]/g, "");

    // Generate a 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check for Twilio Credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    let sentViaTwilio = false;

    if (accountSid && authToken && twilioPhone && !accountSid.includes("REPLACE")) {
      try {
        const response = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              To: cleanPhone,
              From: twilioPhone,
              Body: `Your FORGE-PATH verification code is: ${otpCode}. It expires in 5 minutes. Attempts are limited to 3 tries.`,
            }).toString(),
          }
        );

        if (response.ok) {
          sentViaTwilio = true;
        } else {
          const errData = await response.json();
          console.error("Twilio API error:", errData);
        }
      } catch (twilioErr) {
        console.error("Failed to send via Twilio:", twilioErr);
      }
    }

    // Always save to store so it works
    saveOTP(cleanPhone, otpCode);

    // If Twilio didn't send, print to console for local testing (DX fallback)
    if (!sentViaTwilio) {
      console.log(`\n==================================================`);
      console.log(`[TWILIO SMS BYPASS] OTP for phone ${cleanPhone} is: ${otpCode}`);
      console.log(`==================================================\n`);
    }

    return NextResponse.json({
      success: true,
      message: sentViaTwilio
        ? "Verification code sent to your phone."
        : "Verification code generated (check server logs).",
      mock: !sentViaTwilio,
    });
  } catch (error: any) {
    console.error("Error in OTP send route:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
