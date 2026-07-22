import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, companyName, jobTitle, teamSize, country, message, phone } = body;

    // Inline Server-side Validation
    if (!name || !email || !companyName || !jobTitle || !teamSize || !country || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brevoApiKey = process.env.BREVO_API_KEY || "xkeysib-prod-brevo-email-dispatch-token";

    // 1. Create or Update contact in Brevo database
    const contactRes = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          FIRSTNAME: name,
          COMPANY_NAME: companyName,
          JOB_TITLE: jobTitle,
          TEAM_SIZE: teamSize,
          COUNTRY: country,
          MESSAGE: message,
          SMS: phone || ""
        },
        updateEnabled: true
      }),
    });

    if (!contactRes.ok) {
      const errText = await contactRes.text();
      console.warn("Brevo contact creation returned warning:", errText);
    }

    // 2. Trigger existing transactional template in Brevo
    const emailRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        templateId: 1, // Trigger the existing transactional lead template
        to: [{ email: email }],
        params: {
          FIRSTNAME: name,
          EMAIL: email,
          COMPANY_NAME: companyName,
          JOB_TITLE: jobTitle,
          TEAM_SIZE: teamSize,
          COUNTRY: country,
          MESSAGE: message
        }
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Brevo email send failed:", errText);
      return NextResponse.json({ error: "Failed to dispatch email: " + errText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Enterprise Inquiry Server Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
