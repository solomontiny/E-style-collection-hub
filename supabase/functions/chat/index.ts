import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FAQ {
  keywords: string[];
  response: string;
}

const FAQS: FAQ[] = [
  {
    keywords: ["shipping", "delivery", "ship", "deliver", "how long", "arrive"],
    response:
      "We offer shipping across Nigeria: Standard (3–5 days), Express (1–2 days), and Same-day (Lagos). Tracking is provided for all orders.",
  },
  {
    keywords: ["track", "tracking", "order status", "where is my order"],
    response:
      "You can track your order via your email link or contact us on WhatsApp for live updates.",
  },
  {
    keywords: ["return", "refund", "exchange"],
    response:
      "We allow returns within 7 days if items are unused and in original condition.",
  },
  {
    keywords: ["size", "sizing", "fit"],
    response:
      "We offer XS–XL sizing. If unsure, send your measurements on WhatsApp for help.",
  },
  {
    keywords: ["price", "cost", "how much"],
    response:
      "All prices are in NGN. You can switch currency in the site settings.",
  },
  {
    keywords: ["payment", "pay", "card", "transfer"],
    response:
      "We accept bank transfer, cards, USSD, and Pay on Delivery (Lagos only).",
  },
  {
    keywords: ["contact", "whatsapp", "email"],
    response:
      "Reach us on WhatsApp: +234 808 175 9542 or email: Meggieakenn@gmail.com",
  },
];

const DEFAULT_RESPONSE =
  "I can help you with orders, shipping, returns, sizing, and payments. What would you like to know?";

function findBestMatch(message: string): string {
  const lower = message.toLowerCase();

  let bestScore = 0;
  let bestResponse = DEFAULT_RESPONSE;

  for (const faq of FAQS) {
    let score = 0;

    for (const keyword of faq.keywords) {
      if (lower.includes(keyword)) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestResponse = faq.response;
    }
  }

  return bestResponse;
}

Deno.serve(async (req: Request) => {
  // ✅ CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message } = await req.json().catch(() => ({}));

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const response = findBestMatch(message);

    return new Response(
      JSON.stringify({ reply: response }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});