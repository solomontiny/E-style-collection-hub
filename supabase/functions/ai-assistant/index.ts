import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FAQ {
  keywords: string[];
  response: string;
}

const FAQS: FAQ[] = [
  {
    keywords: ["shipping", "delivery", "ship", "deliver", "how long", "arrive"],
    response:
      "We offer several shipping options within Nigeria:\n\n- **Standard Delivery** (3-5 business days): Free on orders over ₦50,000\n- **Express Delivery** (1-2 business days): ₦3,500\n- **Same-Day Delivery** (Lagos only): ₦5,000\n\nInternational shipping is available to select countries. Delivery times vary by destination (7-14 business days). All orders include tracking.",
  },
  {
    keywords: ["track", "tracking", "order status", "where is my order", "order update"],
    response:
      "You can track your order in a few ways:\n\n1. Check your email for a shipping confirmation with a tracking link\n2. Contact us on WhatsApp at +234 808 175 9542 for a live update\n3. Email us at Meggieakenn@gmail.com with your order number\n\nWe provide tracking for all shipped orders. If you haven't received tracking info within 48 hours of placing your order, please reach out.",
  },
  {
    keywords: ["return", "exchange", "refund", "money back", "send back"],
    response:
      "We want you to love your purchase. Our return policy:\n\n- **7-day return window** from delivery date\n- Items must be unworn, unwashed, with original tags attached\n- Refunds are processed within 5-7 business days\n- Exchanges are available for different sizes/colors (subject to stock)\n- Sale items are final sale\n\nTo initiate a return, contact us on WhatsApp or email Meggieakenn@gmail.com with your order number.",
  },
  {
    keywords: ["size", "sizing", "size guide", "size chart", "fit", "measurement"],
    response:
      "We carry sizes XS through XL. Here's our general guide:\n\n- **XS**: UK 4-6 | US 0-2\n- **S**: UK 8-10 | US 4-6\n- **M**: UK 12-14 | US 8-10\n- **L**: UK 16-18 | US 12-14\n- **XL**: UK 20-22 | US 16-18\n\nEach product page has specific measurements. If you're between sizes, we recommend sizing up for a comfortable fit. Need help? Send us your measurements on WhatsApp and we'll recommend the perfect size!",
  },
  {
    keywords: ["price", "cost", "how much", "pricing", "currency", "naira", "dollar"],
    response:
      "All prices are displayed in Nigerian Naira (NGN) by default. You can switch currencies using the currency selector in the navigation bar — we support NGN, USD, GBP, and JPY.\n\nPrices are converted at current exchange rates. Payment is processed in Naira. We accept bank transfers, card payments, and Pay on Delivery within Lagos.",
  },
  {
    keywords: ["payment", "pay", "card", "transfer", "bank", "pay on delivery", "cod"],
    response:
      "We accept the following payment methods:\n\n- **Bank Transfer** (preferred — no fees)\n- **Debit/Credit Card** (Visa, Mastercard)\n- **Pay on Delivery** (Lagos only, cash or card)\n- **USSD** (all Nigerian banks)\n\nAll online payments are secured with industry-standard encryption. Your payment details are never stored on our servers.",
  },
  {
    keywords: ["contact", "phone", "email", "whatsapp", "reach", "talk", "speak"],
    response:
      "You can reach us through:\n\n- **WhatsApp**: +234 808 175 9542 (fastest response)\n- **Email**: Meggieakenn@gmail.com\n- **Phone**: +234 808 175 9542\n- **Visit Us**: 5 Path Akachukwu Drive, Majek, Lekki–Epe Expressway, Lagos\n\nOur customer service hours are Monday to Saturday, 10:00 AM — 7:00 PM (WAT).",
  },
  {
    keywords: ["location", "address", "store", "visit", "shop address", "where are you", "where is"],
    response:
      "Our store is located at:\n\n**5 Path Akachukwu Drive, Majek, Lekki–Epe Expressway, Lagos, Nigeria**\n\nWe're open Monday to Saturday, 10:00 AM — 7:00 PM. We recommend calling ahead for private shopping appointments.",
  },
  {
    keywords: ["hours", "open", "close", "opening", "closing", "when", "time"],
    response:
      "Our store hours are:\n\n- **Monday — Saturday**: 10:00 AM — 7:00 PM (WAT)\n- **Sunday**: Closed\n\nOnline orders are processed 24/7. Customer support is available during store hours via WhatsApp and email.",
  },
  {
    keywords: ["product", "collection", "category", "what do you sell", "items", "clothes", "fashion"],
    response:
      "We curate premium fashion across these collections:\n\n- **Dresses** — From casual to occasion wear\n- **Outerwear** — Blazers, coats, and jackets\n- **Bags** — Handbags, clutches, and totes\n- **Shoes** — Heels, flats, and sandals\n- **Tops** — Blouses, shirts, and knits\n- **Bottoms** — Trousers, skirts, and shorts\n\nBrowse our full collection at eclection.com/shop. New pieces are added weekly!",
  },
  {
    keywords: ["order", "place order", "buy", "purchase", "checkout", "how to order"],
    response:
      "Placing an order is easy:\n\n1. Browse our collection and add items to your cart\n2. Select your size and color preferences\n3. Proceed to checkout\n4. Enter your delivery details\n5. Choose your payment method\n6. Confirm your order\n\nYou'll receive an email confirmation with your order number. Need help? Contact us on WhatsApp and we'll guide you through the process.",
  },
  {
    keywords: ["cancel", "cancellation", "cancel order"],
    response:
      "Orders can be cancelled within 2 hours of placement. After that, we begin processing and cancellation may not be possible.\n\nTo cancel, contact us immediately on WhatsApp at +234 808 175 9542 or email Meggieakenn@gmail.com with your order number. If the order has already shipped, we can arrange a return once delivered.",
  },
  {
    keywords: ["discount", "sale", "promo", "coupon", "offer", "deal"],
    response:
      "We occasionally offer promotions and exclusive deals to our newsletter subscribers. Sign up on our website to be the first to know about:\n\n- New collection launches\n- Seasonal sales\n- Exclusive subscriber discounts\n- Early access to limited pieces\n\nFollow us on social media for flash sales and styling inspiration!",
  },
  {
    keywords: ["quality", "material", "fabric", "authentic", "genuine", "real"],
    response:
      "Quality is at the heart of everything we do. We source premium fabrics and materials, working with skilled artisans to create pieces that last. Each item undergoes quality checks before shipping.\n\nIf you ever receive an item that doesn't meet your expectations, please contact us immediately — we stand behind our products 100%.",
  },
];

const DEFAULT_RESPONSE =
  "I'd be happy to help! Could you provide more details about your question? I can assist with:\n\n- Orders and tracking\n- Shipping and delivery\n- Returns and exchanges\n- Product information and sizing\n- Payment methods\n- Store location and hours\n\nOr contact us directly on WhatsApp at +234 808 175 9542 for immediate assistance.";

const GREETINGS = [
  "Hello! Welcome to Eclection Customer Service. I can help you with orders, products, shipping, returns, and more. What would you like to know?",
  "Hi there! I'm your Eclection AI assistant. How can I help you today? Feel free to ask about our collections, orders, or any other questions.",
  "Welcome! I'm here to help with anything related to Eclection. Ask me about shipping, returns, sizing, or anything else!",
];

function findBestMatch(message: string): string {
  const lower = message.toLowerCase().trim();

  // Check for greetings
  if (/^(hi|hello|hey|good\s?(morning|afternoon|evening)|howdy|greetings)/i.test(lower)) {
    return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  }

  // Check for thanks
  if (/^(thanks|thank you|thx|appreciate)/i.test(lower)) {
    return "You're welcome! Is there anything else I can help you with? Don't hesitate to ask.";
  }

  // Score each FAQ by keyword matches
  let bestScore = 0;
  let bestResponse = DEFAULT_RESPONSE;

  for (const faq of FAQS) {
    let score = 0;
    for (const keyword of faq.keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length; // Longer keyword matches score higher
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
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = findBestMatch(message);

    return new Response(
      JSON.stringify({ response }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
