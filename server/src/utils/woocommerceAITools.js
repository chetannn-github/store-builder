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
      name: "guideToAddProduct",
      description: "Guide the user to the product creation page. Call this when the user wants to add, list, or create a new product.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToCreateCoupon",
      description: "Guide the user to the coupon management page. Call this when the user wants to create, add, or manage a discount coupon.",
      parameters: { type: "object", properties: {} } 
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

const getAdminLink = (store, path = "") => {
  
  const baseAdminUrl = store.adminUrl.replace(/\/$/, ""); 
  return path ? `${baseAdminUrl}/${path}` : `${baseAdminUrl}/`;
};

export const aiActionMap = {
  getStoreAudit: {
    execute: async (ns) => await woo.getStoreAudit(ns),
    getReply: (result, args, store) => {
      const summary = result?.audit?.summary || {};
      const products = summary.totalProducts || 0;
      const orders = summary.totalOrders || 0;
      const coupons = summary.totalCoupons || 0;
      const codStatus = summary.isCodEnabled ? "enabled ✅" : "disabled ❌";

      return {
        message: `Here is your store audit: You currently have ${products} products, ${orders} orders, and ${coupons} active coupons. Cash on Delivery is currently ${codStatus}. Let me know what you'd like to manage next! 📊`,
        link: store.adminUrl, // Seedha Dashboard khulega
        linkLabel: "📊 Open Dashboard"
      };
    }
  },
  
  enableCODPayment: {
    execute: async (ns) => await woo.enableCODPayment(ns),
    getReply: (result, args, store) => {
      return {
        message: "Cash on Delivery (COD) has been successfully enabled! Your customers can now select this payment method during checkout. 💳",
        link: getAdminLink(store, "admin.php?page=wc-settings&tab=checkout"),
        linkLabel: "💳 View Payment Settings"
      };
    }
  },
  
  checkPaymentStatus: {
    execute: async (ns) => await woo.checkPaymentStatus(ns),
    getReply: (result, args, store) => {
      const msg = result.isCODEnabled 
        ? "Payment status check complete. Cash on Delivery (COD) is currently active and available for your customers. ✅" 
        : "Payment status check complete. Cash on Delivery (COD) is currently disabled. Would you like me to enable it for you?";
      
      return {
        message: msg,
        link: getAdminLink(store, "admin.php?page=wc-settings&tab=checkout"),
        linkLabel: "⚙️ Check Settings"
      };
    }
  },
  getAllCoupons: {
    execute: async (ns) => await woo.getAllCoupons(ns),
    getReply: (result, args, store) => {
      if (!result?.count || result.count === 0) {
        return {
          message: "You currently don't have any active coupons in your store. Let me know if you want me to create a new one! 🎫",
          link: getAdminLink(store, "edit.php?post_type=shop_coupon"),
          linkLabel: "➕ Create Coupon"
        };
      }
      
      const couponDetails = result.data.map((coupon, index) => {
        const discountSymbol = coupon.discount_type === 'percent' ? '%' : ' flat';
        return `${index + 1}. Code: ${coupon.code.toUpperCase()} | ID: ${coupon.id} | Discount: ${coupon.amount}${discountSymbol}`;
      }).join("\n");

      return {
        message: `I found ${result.count} active coupons in your store:\n\n${couponDetails}\n\nIf you need to remove any old ones, just tell me the Coupon ID and I'll delete it for you! 🗑️`,
        link: getAdminLink(store, "edit.php?post_type=shop_coupon"),
        linkLabel: "🛠️ Manage Coupons"
      };
    }
  },
  
  deleteStoreCoupon: {
    execute: async (ns, args) => await woo.deleteStoreCoupon(ns, args.couponId),
    getReply: (result, args, store) => {
      return {
        message: `The coupon with ID ${args.couponId} has been permanently deleted from your store. It can no longer be used by customers. 🗑️`,
        link: getAdminLink(store, "edit.php?post_type=shop_coupon"),
        linkLabel: "🎫 View Remaining Coupons"
      };
    }
  },
  
  getAllOrders: {
    execute: async (ns) => await woo.getAllOrders(ns),
    getReply: (result, args, store) => {
      return {
        message: `You currently have a total of ${result.count} orders placed in your store. Let me know if you need to review specific order details! 📦`,
        link: getAdminLink(store, "edit.php?post_type=shop_order"),
        linkLabel: "📦 View Orders"
      };
    }
  },
  guideToAddProduct: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => {
      return {
        message: "Adding a new product is super easy! Click the button below, enter your product name, price, upload an image, and hit 'Publish'. 📦",
        link: getAdminLink(store, "post-new.php?post_type=product"),
        linkLabel: "➕ Add New Product"
      };
    }
  },

  guideToCreateCoupon: {
    execute: async () => ({ success: true }), // NO BACKEND CALL
    getReply: (result, args, store) => {
      return {
        message: "To create a discount code, click the button below. Click 'Add coupon', type your custom code (e.g., FESTIVAL50), set the discount amount, and hit Publish! 🎟️",
        link: getAdminLink(store, "edit.php?post_type=shop_coupon"),
        linkLabel: "🎫 Create/Manage Coupons"
      };
    }
  }
};


export const SUGGESTION_RULES = [  
  {
    condition: (summary) => !summary.isCodEnabled,
    data: { title: "💳 Enable COD", prompt: "Store pe Cash on Delivery (COD) chalu kar do." }
  },
  {
    condition: (summary) => summary.totalProducts === 0,
    data: { title: "📦 Add First Product", prompt: "Bhai, mujhe naya product add karna hai, kahan se karu?" }
  },
  {
    condition: (summary) => summary.totalProducts > 0,
    data: { title: "➕ Add Another Product", prompt: "Mujhe ek aur naya product list karna hai store par." }
  },
  {
    condition: (summary) => summary.totalOrders === 0,
    data: { title: "👀 Check Orders", prompt: "Bhai, kya mere store pe koi naya order aaya hai abhi tak?" }
  },
  {
    condition: (summary) => summary.totalCoupons === 0,
    data: { title: "🎟️ Create Coupon", prompt: "Customers ke liye discount coupon banana hai, guide karo." }
  },
  {
    condition: (summary) => summary.totalCoupons > 0,
    data: { title: "🎫 Manage Coupons", prompt: "Mere store ke saare active coupons dikhao." }
  },
  {
    condition: () => true, 
    data: { title: "🤖 Store Audit", prompt: "Store ki poori report do, kya-kya active hai abhi?" }
  }
];