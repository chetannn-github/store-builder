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
      name: "guideToAllProducts",
      description: "Guide the user to the products list page. Call this when they want to edit, delete, or manage existing products.",
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
  },
  {
    type: "function",
    function: {
      name: "guideToThemeCustomization",
      description: "Guide the user to customize their store's appearance, theme, logo, or colors.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToShippingSettings",
      description: "Guide the user to set up shipping zones, delivery charges, or free shipping.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToPaymentGateways",
      description: "Guide the user to set up online payment gateways like Stripe, PayPal, or Razorpay.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToAnalytics",
      description: "Guide the user to the store analytics/reports page to check sales and revenue.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToUserManagement",
      description: "Guide the user to manage staff, customers, or profile settings.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToPlugins",
      description: "Guide the user to install new features, plugins, or manage existing ones.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToGeneralSettings",
      description: "Guide the user to change store name, tagline, timezone, or email settings.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToSEO",
      description: "Guide the user to SEO settings, permalinks, or site visibility.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToInventory",
      description: "Guide user to manage stock levels, out-of-stock products, and inventory settings.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToTaxSettings",
      description: "Guide user to setup GST, VAT, or other tax calculations for their products.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToEmailTemplates",
      description: "Guide user to customize the emails sent to customers (Order confirmation, invoices).",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToMediaLibrary",
      description: "Guide user to manage uploaded images, logos, and product photos.",
      parameters: { type: "object", properties: {} }
    }
  },
  {
    type: "function",
    function: {
      name: "guideToSystemStatus",
      description: "Guide user to check if the store has any technical errors or server issues.",
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
        link: getAdminLink(store, ""), 
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
    getReply: (result, args, store) => ({
      message: "Adding a new product is super easy! Click the button below, enter your product name, price, upload an image, and hit 'Publish'. 📦",
      link: getAdminLink(store, "post-new.php?post_type=product"),
      linkLabel: "➕ Add New Product"
    })
  },

  guideToAllProducts: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "You can view, edit, or delete all your existing products from the Products dashboard. Click below to manage your inventory! 📋",
      link: getAdminLink(store, "edit.php?post_type=product"),
      linkLabel: "📋 Manage Products"
    })
  },

  guideToCreateCoupon: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "To create a discount code, click the button below. Click 'Add coupon', type your custom code (e.g., FESTIVAL50), set the discount amount, and hit Publish! 🎟️",
      link: getAdminLink(store, "edit.php?post_type=shop_coupon"),
      linkLabel: "🎫 Create/Manage Coupons"
    })
  },
  guideToThemeCustomization: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Want to change how your store looks? You can update your logo, colors, and layout right from the Theme Customizer. Click below to start designing! 🎨",
      link: getAdminLink(store, "customize.php"),
      linkLabel: "🎨 Customize Appearance"
    })
  },

  guideToShippingSettings: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Setting up delivery charges is important! Click below to go to Shipping Settings. From there, you can add 'Shipping Zones' and set up flat rates or free delivery. 🚚",
      link: getAdminLink(store, "admin.php?page=wc-settings&tab=shipping"),
      linkLabel: "🚚 Shipping Settings"
    })
  },

  guideToPaymentGateways: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Want to accept online payments? Go to the Payments tab below. You can enable default options or add plugins for Stripe, PayPal, or Razorpay! 💳",
      link: getAdminLink(store, "admin.php?page=wc-settings&tab=checkout"),
      linkLabel: "💳 Setup Online Payments"
    })
  },

  guideToAnalytics: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Let's check your store's performance! You can see your total sales, top products, and revenue directly in the WooCommerce Analytics dashboard. 📈",
      link: getAdminLink(store, "admin.php?page=wc-admin&path=/analytics/overview"),
      linkLabel: "📈 View Analytics"
    })
  },
  guideToUserManagement: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Aap apne customers aur staff members ko yahan se manage kar sakte hain. Naya user add karne ke liye 'Add New' pe click karein! 👥",
      link: getAdminLink(store, "users.php"),
      linkLabel: "👥 Manage Users"
    })
  },

  guideToPlugins: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Store mein naye features (jaise WhatsApp chat, Invoice PDF) add karne ke liye plugins install karein. 🔌",
      link: getAdminLink(store, "plugin-install.php"),
      linkLabel: "🔌 Add New Plugins"
    })
  },

  guideToGeneralSettings: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Store ka title, description ya contact email change karne ke liye General Settings mein jao. ⚙️",
      link: getAdminLink(store, "options-general.php"),
      linkLabel: "⚙️ General Settings"
    })
  },

  guideToSEO: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "SEO aur links (Permalinks) manage karne ke liye niche click karein. Isse aapki site Google search mein behtar dikhegi! 🔍",
      link: getAdminLink(store, "options-permalink.php"),
      linkLabel: "🔍 SEO/Link Settings"
    })
  },
  guideToInventory: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Stock manage karne ke liye inventory page pe jao. Yahan aap check kar sakte ho kaunsa item out-of-stock hone wala hai! 📦",
      link: getAdminLink(store, "admin.php?page=wc-reports&tab=stock"),
      linkLabel: "📦 Check Inventory"
    })
  },

  guideToTaxSettings: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "GST ya Tax settings set karne ke liye niche click karo. Yahan aap 'Tax Classes' aur 'Standard Rates' define kar sakte ho. 🧾",
      link: getAdminLink(store, "admin.php?page=wc-settings&tab=tax"),
      linkLabel: "🧾 Setup Tax/GST"
    })
  },

  guideToEmailTemplates: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Customer ko jo emails jaate hain unka design ya content change karne ke liye yahan jao. 📧",
      link: getAdminLink(store, "admin.php?page=wc-settings&tab=email"),
      linkLabel: "📧 Edit Email Templates"
    })
  },

  guideToMediaLibrary: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Aapki saari photos, logos aur files yahan store hoti hain. Inhe delete ya edit karne ke liye Library kholo. 🖼️",
      link: getAdminLink(store, "upload.php"),
      linkLabel: "🖼️ Media Library"
    })
  },

  guideToSystemStatus: {
    execute: async () => ({ success: true }),
    getReply: (result, args, store) => ({
      message: "Agar store mein kuch gadbad lag rahi hai, toh System Status check karo. Ye batayega ki server aur plugins sahi se kaam kar rahe hain ya nahi. 🛠️",
      link: getAdminLink(store, "admin.php?page=wc-status"),
      linkLabel: "🛠️ Check System Health"
    })
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
    data: { title: "🎨 Change Store Look", prompt: "Mujhe store ka logo aur colors change karne hain." }
  },
  {
    condition: () => true, 
    data: { title: "🚚 Setup Shipping", prompt: "Delivery charges aur shipping kaise set karu?" }
  },
  {
    condition: (summary) => summary.totalOrders > 0, 
    data: { title: "📈 View Sales", prompt: "Mere store ki total sales aur analytics dikhao." }
  },
  {
    condition: () => true, 
    data: { title: "🔌 Add Features", prompt: "Mujhe store pe naye features/plugins add karne hain." }
  },
  {
    condition: () => true, 
    data: { title: "👥 Manage Staff", prompt: "Staff members ya users kaise manage karu?" }
  },
  {
    condition: () => true, 
    data: { title: "📧 Custom Emails", prompt: "Mujhe customer ko jaane wale order emails edit karne hain." }
  },
  {
    condition: () => true, 
    data: { title: "🧾 Setup GST", prompt: "Store pe GST/Tax kaise calculate karu?" }
  },
  {
    condition: () => true, 
    data: { title: "🖼️ Manage Photos", prompt: "Meri saari uploaded images kahan dikhengi?" }
  }
];