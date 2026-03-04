import * as woo from "../services/woocommerceServices.js";

export const woocommerceAITools = [
  {
    type: "function",
    function: {
      name: "getStoreAudit",
      description: "Get full store snapshot (products, orders, coupons, payments status). Call this when user asks about store health, stats, or overview.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "enableCODPayment",
      description: "Enable Cash on Delivery (COD) payment method for the store.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "checkPaymentStatus",
      description: "Check which payment methods (like COD) are currently enabled in the store.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "addProductAndGetLink",
      description: "Add a new product to the store and get its live URL.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string", description: "Name of the product" },
          price: { type: "string", description: "Regular price of the product" }
        },
        required: ["name", "price"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "createCoupon",
      description: "Create a discount coupon in the store.",
      parameters: {
        type: "object",
        properties: {
          code: { type: "string", description: "Coupon code, e.g., SAVE50" },
          amount: { type: "string", description: "Discount value" },
          type: { type: "string", enum: ["percent", "fixed_cart"], description: "Type of discount" }
        },
        required: ["code", "amount"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getAllCoupons",
      description: "Get a list of all active discount coupons in the store.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "deleteStoreCoupon",
      description: "Delete a specific coupon using its ID.",
      parameters: {
        type: "object",
        properties: {
          couponId: { type: "string", description: "The ID of the coupon to delete" }
        },
        required: ["couponId"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "getAllOrders",
      description: "Get a list of all customer orders in the store.",
      parameters: { type: "object", properties: {} }
    }
  }
];


export const aiActionMap = {
  getStoreAudit: {
    execute: async (ns) => await woo.getStoreAudit(ns),
    getReply: (result) => "Store ki report ready hai. Sab badhiya chal raha hai! 📊"
  },
  
  enableCODPayment: {
    execute: async (ns) => await woo.enableCODPayment(ns),
    getReply: () => "Bhai, Cash on Delivery (COD) enable kar diya hai! 💳"
  },
  
  checkPaymentStatus: {
    execute: async (ns) => await woo.checkPaymentStatus(ns),
    getReply: (result) => result.isCODEnabled ? "COD active hai bhai! ✅" : "Abhi COD band hai."
  },
  
  addProductAndGetLink: {
    execute: async (ns, args) => await woo.addProductAndGetLink(ns, args),
    // Dynamic reply using args
    getReply: (result, args) => `Bhai, naya product '${args.name}' add kar diya hai! 🚀 Preview refresh ho raha hai...`
  },
  
  createCoupon: {
    execute: async (ns, args) => await woo.createCoupon(ns, args),
    getReply: (result, args) => `Done! '${args.code}' coupon active ho gaya hai ${args.amount} discount ke sath. 🎟️`
  },
  
  getAllCoupons: {
    execute: async (ns) => await woo.getAllCoupons(ns),
    getReply: (result) => `Total ${result.count} coupons mile hain bhai. 🎫`
  },
  
  deleteStoreCoupon: {
    execute: async (ns, args) => await woo.deleteStoreCoupon(ns, args.couponId),
    getReply: (result, args) => `Coupon ID ${args.couponId} delete kar diya permanently! 🗑️`
  },
  
  getAllOrders: {
    execute: async (ns) => await woo.getAllOrders(ns),
    getReply: (result) => `Aapke paas total ${result.count} orders hain abhi. 📦`
  }
};


export const SUGGESTION_RULES = [
  {
    condition: (summary) => !summary.isCodEnabled,
    data: { title: "💳 Enable COD", prompt: "Bhai, store pe Cash on Delivery (COD) chalu kar de." }
  },
  {
    condition: (summary) => summary.totalProducts === 0,
    data: { title: "📦 Add First Product", prompt: "Ek 'Premium T-Shirt' add kar do 499 rupees mein." }
  },
  {
    condition: (summary) => summary.totalProducts > 0 && summary.totalOrders === 0,
    data: { title: "👀 Wait for Orders", prompt: "Bhai, kya mere products live hain? Koi order nahi aaya abhi tak." }
  },
  {
    condition: (summary) => summary.totalProducts > 0 && summary.totalOrders > 0,
    data: { title: "📈 Check Orders", prompt: "Dikhao abhi tak kitne orders aaye hain." }
  },
  {
    condition: (summary) => summary.totalCoupons === 0,
    data: { title: "🎟️ Create Coupon", prompt: "Naye customers ke liye 'WELCOME50' coupon bana do 50% discount ke sath." }
  },
  {
    condition: () => true, // Ye hamesha true rahega (Default fallback)
    data: { title: "🤖 Store Audit", prompt: "Store ki poori report do, kya-kya active hai abhi?" }
  }
];
