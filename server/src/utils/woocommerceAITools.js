import * as woo from "../services/woocommerceServices.js";
import { extractProductPath } from "./helper.js";

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
    getReply: (result) => {
      const summary = result?.audit?.summary || {};
      const products = summary.totalProducts || 0;
      const orders = summary.totalOrders || 0;
      const coupons = summary.totalCoupons || 0;
      const codStatus = summary.isCodEnabled ? "enabled ✅" : "disabled ❌";

      return `Here is your store audit: You currently have ${products} products, ${orders} orders, and ${coupons} active coupons. Cash on Delivery is currently ${codStatus}. Let me know what you'd like to manage next! 📊`;
    }
  },
  
  enableCODPayment: {
    execute: async (ns) => await woo.enableCODPayment(ns),
    getReply: () => "Cash on Delivery (COD) has been successfully enabled! Your customers can now select this payment method during checkout. 💳"
  },
  
  checkPaymentStatus: {
    execute: async (ns) => await woo.checkPaymentStatus(ns),
    getReply: (result) => result.isCODEnabled 
      ? "Payment status check complete. Cash on Delivery (COD) is currently active and available for your customers. ✅" 
      : "Payment status check complete. Cash on Delivery (COD) is currently disabled. Would you like me to enable it for you?"
  },
  
  addProductAndGetLink: {
    execute: async (ns, args) => await woo.addProductAndGetLink(ns, args),

    getReply: (result, args, store) => {
      const productPath = extractProductPath(result?.link);
      const fullUrl = `${store.storeUrl}${productPath}`;

      return {
        message: `Success! I've added '${args.name}' priced at ₹${args.price}.`,
        link: fullUrl,
        linkLabel: "🔗 View Live Product"
      };
    }
  },
  
  createCoupon: {
    execute: async (ns, args) => await woo.createCoupon(ns, args),
    getReply: (result, args) => {
      const discountSymbol = args.type === 'percent' ? '%' : ' flat';
      return `Your promo code is ready! Customers can now use the code '${args.code.toUpperCase()}' at checkout to get a ${args.amount}${discountSymbol} discount. 🎟️`;
    }
  },
  
  getAllCoupons: {
    execute: async (ns) => await woo.getAllCoupons(ns),
    getReply: (result) => {
      if (!result?.count || result.count === 0) {
        return "You currently don't have any active coupons in your store. Let me know if you want me to create a new one! 🎫";
      }
      
      const couponDetails = result.data.map((coupon, index) => {
        const discountSymbol = coupon.discount_type === 'percent' ? '%' : ' flat';
        return `${index + 1}. Code: ${coupon.code.toUpperCase()} | ID: ${coupon.id} | Discount: ${coupon.amount}${discountSymbol}`;
      }).join("\n");

      return `I found ${result.count} active coupons in your store:\n\n${couponDetails}\n\nIf you need to remove any old ones, just tell me the Coupon ID and I'll delete it for you! 🗑️`;
    }
  },
  
  deleteStoreCoupon: {
    execute: async (ns, args) => await woo.deleteStoreCoupon(ns, args.couponId),
    getReply: (result, args) => `The coupon with ID ${args.couponId} has been permanently deleted from your store. It can no longer be used by customers. 🗑️`
  },
  
  getAllOrders: {
    execute: async (ns) => await woo.getAllOrders(ns),
    getReply: (result) => `You currently have a total of ${result.count} orders placed in your store. Let me know if you need to review specific order details! 📦`
  }
};


export const SUGGESTION_RULES = [  {
    condition: (summary) => !summary.isCodEnabled,
    data: { title: "💳 Enable COD", prompt: "Bhai, store pe Cash on Delivery (COD) chalu kar de." }
  },
    {
    condition: (summary) => summary.totalProducts === 0,
    data: { title: "📦 Add First Product", prompt: "Ek 'Premium T-Shirt' add kar do 499 rupees mein." }
  },
  {
    condition: (summary) => summary.totalProducts > 0,
    data: { title: "➕ Add Another Product", prompt: "Ek naya 'Smart Watch' add kar do 1999 rupees mein." }
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
    condition: (summary) => summary.totalCoupons > 0,
    data: { title: "🎫 View Coupons", prompt: "Mere store ke saare active coupons dikhao." }
  },
  {
    condition: (summary) => summary.totalCoupons > 0,
    data: { title: "🗑️ Manage Coupons", prompt: "Mujhe ek purana coupon delete karna hai, pehle saare coupons list karo." }
  },
  {
    condition: (summary) => summary.isCodEnabled,
    data: { title: "✅ Check Payments", prompt: "Verify karo ki mere store pe payment methods kaunse active hain." }
  },
  {
    condition: () => true, 
    data: { title: "🤖 Store Audit", prompt: "Store ki poori report do, kya-kya active hai abhi?" }
  }
];