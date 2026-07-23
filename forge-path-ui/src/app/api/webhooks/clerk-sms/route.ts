import { NextResponse } from "next/server";
import { Webhook } from "svix";
import twilio from "twilio";

// Webhook payload interface for Clerk
interface ClerkWebhookEvent {
  data: {
    to_phone_number: string;
    message: string;
    [key: string]: any;
  };
  object: string;
  type: string;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET environment variable.");
    return NextResponse.json(
      { success: false, error: "Webhook secret is not configured." },
      { status: 500 }
    );
  }

  // Get the headers
  const svix_id = req.headers.get("svix-id");
  const svix_timestamp = req.headers.get("svix-timestamp");
  const svix_signature = req.headers.get("svix-signature");

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json(
      { success: false, error: "Missing svix headers." },
      { status: 400 }
    );
  }

  // Get the raw body
  let payload: string;
  try {
    payload = await req.text();
  } catch (err) {
    console.error("Failed to read request body:", err);
    return NextResponse.json(
      { success: false, error: "Invalid body payload." },
      { status: 400 }
    );
  }

  // Create a new Svix instance with our secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkWebhookEvent;

  // Verify the payload
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as ClerkWebhookEvent;
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message || err);
    return NextResponse.json(
      { success: false, error: "Webhook signature verification failed." },
      { status: 400 }
    );
  }

  // Handle the event
  const eventType = evt.type;
  console.log(`Received Clerk Webhook of type: ${eventType}`);

  if (eventType === "sms.created") {
    const { to_phone_number, message } = evt.data;

    if (!to_phone_number || !message) {
      return NextResponse.json(
        { success: false, error: "Missing recipient number or message body in payload data." },
        { status: 400 }
      );
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !twilioPhone) {
      console.error("Missing Twilio credentials in environment variables.");
      return NextResponse.json(
        { success: false, error: "SMS gateway provider is not configured." },
        { status: 500 }
      );
    }

    try {
      // Initialize Twilio client
      const client = twilio(accountSid, authToken);

      // Send SMS
      const result = await client.messages.create({
        body: message,
        from: twilioPhone,
        to: to_phone_number,
      });

      console.log(`SMS successfully dispatched via Twilio to ${to_phone_number}. Msg SID: ${result.sid}`);

      return NextResponse.json({
        success: true,
        message: "SMS message successfully dispatched.",
        messageSid: result.sid,
      });
    } catch (twilioErr: any) {
      console.error("Twilio message dispatch failed:", twilioErr);
      return NextResponse.json(
        { success: false, error: `Twilio dispatch failed: ${twilioErr.message || twilioErr}` },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    success: true,
    message: `Ignored unhandled webhook event: ${eventType}`,
  });
}
