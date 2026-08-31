/**
 * DermoPure — Store Configuration
 * ديرمو بيور - إعدادات المتجر
 *
 * IMPORTANT: This file is loaded in the browser, so any values placed here
 * are publicly visible to anyone who views the page source. Do not place
 * secrets here that grant write/delete access to sensitive systems.
 * A Telegram bot token that can only send messages to a fixed chat is
 * low-risk, but consider proxying this through a serverless function
 * (Cloudflare Worker / Vercel Edge Function) for production use.
 */

export const STORE_CONFIG = {
  // ---- Store identity ----
  storeName: "DermoPure",
  storeNameAr: "ديرمو بيور",
  storeTagline: "متجر المواد الشبه صيدلانية والعناية بالبشرة",
  currency: "دج",
  currencyCode: "DZD",

  // ---- Telegram Bot API (for "أطلب الآن" direct orders) ----
  // Create a bot via @BotFather, then get your chat id via @userinfobot
  // or by messaging the bot and calling https://api.telegram.org/bot<token>/getUpdates
  telegram: {
    botToken: "YOUR_TELEGRAM_BOT_TOKEN", // e.g. "123456789:AAExxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    chatId: "YOUR_TELEGRAM_CHAT_ID", // e.g. "-1001234567890"
    enabled: false, // set to true once botToken/chatId are configured
  },

  // ---- Optional: Google Sheet Webhook (Apps Script) fallback / mirror ----
  googleSheetWebhookUrl: "", // e.g. "https://script.google.com/macros/s/XXXX/exec"

  // ---- WhatsApp ----
  whatsapp: {
    number: "213797733908", // international format, no + and no leading 0
  },

  // ---- Delivery pricing (optional, shown in cart summary) ----
  deliveryFeeHome: 600,
  deliveryFeeOffice: 400,
  freeDeliveryThreshold: 8000,
};

// 58 Algerian wilayas (code + Arabic name)
export const WILAYAS = [
  { code: "01", name: "أدرار" },
  { code: "02", name: "الشلف" },
  { code: "03", name: "الأغواط" },
  { code: "04", name: "أم البواقي" },
  { code: "05", name: "باتنة" },
  { code: "06", name: "بجاية" },
  { code: "07", name: "بسكرة" },
  { code: "08", name: "بشار" },
  { code: "09", name: "البليدة" },
  { code: "10", name: "البويرة" },
  { code: "11", name: "تمنراست" },
  { code: "12", name: "تبسة" },
  { code: "13", name: "تلمسان" },
  { code: "14", name: "تيارت" },
  { code: "15", name: "تيزي وزو" },
  { code: "16", name: "الجزائر العاصمة" },
  { code: "17", name: "الجلفة" },
  { code: "18", name: "جيجل" },
  { code: "19", name: "سطيف" },
  { code: "20", name: "سعيدة" },
  { code: "21", name: "سكيكدة" },
  { code: "22", name: "سيدي بلعباس" },
  { code: "23", name: "عنابة" },
  { code: "24", name: "قالمة" },
  { code: "25", name: "قسنطينة" },
  { code: "26", name: "المدية" },
  { code: "27", name: "مستغانم" },
  { code: "28", name: "المسيلة" },
  { code: "29", name: "معسكر" },
  { code: "30", name: "ورقلة" },
  { code: "31", name: "وهران" },
  { code: "32", name: "البيض" },
  { code: "33", name: "إليزي" },
  { code: "34", name: "برج بوعريريج" },
  { code: "35", name: "بومرداس" },
  { code: "36", name: "الطارف" },
  { code: "37", name: "تندوف" },
  { code: "38", name: "تيسمسيلت" },
  { code: "39", name: "الوادي" },
  { code: "40", name: "خنشلة" },
  { code: "41", name: "سوق أهراس" },
  { code: "42", name: "تيبازة" },
  { code: "43", name: "ميلة" },
  { code: "44", name: "عين الدفلى" },
  { code: "45", name: "النعامة" },
  { code: "46", name: "عين تموشنت" },
  { code: "47", name: "غرداية" },
  { code: "48", name: "غليزان" },
  { code: "49", name: "المغير" },
  { code: "50", name: "المنيعة" },
  { code: "51", name: "أولاد جلال" },
  { code: "52", name: "برج باجي مختار" },
  { code: "53", name: "بني عباس" },
  { code: "54", name: "تيميمون" },
  { code: "55", name: "تقرت" },
  { code: "56", name: "جانت" },
  { code: "57", name: "إن صالح" },
  { code: "58", name: "إن قزام" },
];
