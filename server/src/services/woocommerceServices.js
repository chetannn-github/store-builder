import { createCouponCommand, createProductCommand, getAllCouponsCommand, getAllOrdersCommand, getAllProductCommand, getCouponDeletionCommand, getEnableCODCommand, getEnabledPaymentMethodsCommand } from "../utils/woocommerceCommands.js";
import { executeCommand, getPodName } from "./k8sServices.js";

export const enableCODPayment = async (namespace) => {
  try {
    const podName = await getPodName(namespace);
    if (!podName) throw new Error("No active podName found");

    const enableCODCommand = getEnableCODCommand(podName, namespace);
    const output = await executeCommand(enableCODCommand);
    return { success: true, output};
  } catch (error) {
    console.error("Failed to enable COD:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkPaymentStatus = async (namespace) => {
  const podName = await getPodName(namespace);
  if (!podName) return { error: "Pod not ready" };
  const cmd = getEnabledPaymentMethodsCommand(podName,namespace)

  try {
    const  stdout  = await executeCommand(cmd);
    const gateways = JSON.parse(stdout);
    
    const cod = gateways.find(g => g.id === 'cod');
    return {
      success: true,
      isCODEnabled: cod?.enabled === true || cod?.enabled === 'yes',
      gateways
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const addProductAndGetLink = async (namespace, productData) => {
  
  const podName = await getPodName(namespace);
  if (!podName) return { error: "Pod not ready" };
  try {
    const createCmd = createProductCommand(podName,namespace,productData)
    const createOut = await executeCommand(createCmd);
    const productId = createOut.match(/\d+/)[0]; 

    const linkCmd = `kubectl exec ${podName} -n ${namespace} -- wp post get ${productId} --field=url --allow-root`;
    const linkOut = await executeCommand(linkCmd);

    return {
      success: true,
      link: linkOut.trim(),
      message: `Product added! Link: ${linkOut.trim()}`
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const createCoupon = async (namespace, data) => {
  try {
    const podName = await getPodName(namespace);
    if (!podName) return { error: "Pod not ready" };
    const { code, amount, type } = data;
    const cmd = createCouponCommand(podName,namespace,code,amount,type);
    await executeCommand(cmd, "Coupon-Create");
    return {
      success : true,
      message : "Coupon added successfully!"
    }
  } catch (error) {
    return {
      success : false,
      message : "Something went wrong"
    }
  }
  
};

export const getAllCoupons = async (namespace) => {
  const podName = await getPodName(namespace);
  if (!podName) return { error: "Pod not ready" };
  try {
    const cmd = getAllCouponsCommand(podName,namespace);
    const stdout  = await executeCommand(cmd);
    const coupons = JSON.parse(stdout);

    return {
      success: true,
      count: coupons.length,
      data: coupons
    };
  } catch (error) {
    console.error("Error fetching coupons:", error.message);
    return { success: false, error: error.message };
  }
};


export const deleteStoreCoupon = async (namespace, couponId) => {
  try {
    const podName = await getPodName(namespace);
    if (!podName) return { error: "Pod not ready" };
    const cmd = getCouponDeletionCommand(podName,namespace,couponId);
    await executeCommand(cmd);
    
    return {
      success: true,
      message: `Coupon ${couponId} has been deleted permanently.`,
    };
  } catch (error) {
    console.error("Error deleting coupon:", error.message);
    return { success: false, error: error.message };
  }
};


export const getAllOrders = async (namespace) => {
  try {
    const podName = await getPodName(namespace);
    if (!podName) return { error: "Pod not ready" };

    const cmd = getAllOrdersCommand(podName,namespace)
    const stdout = await executeCommand(cmd);
    const orders = JSON.parse(stdout);

    return {
      success: true,
      count: orders.length,
      data: orders
    };
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    return { success: false, error: error.message };
  }
};

export const getStoreAudit = async (namespace) => {
  const podName = await getPodName(namespace);
  if (!podName) return { error: "Pod not ready" };
  try {
    console.log(`[Audit] Fetching full store snapshot for ${namespace}...`);

    const commands = {
      products: getAllProductCommand(podName,namespace),
      orders: getAllOrdersCommand(podName,namespace),
      coupons: getAllCouponsCommand(podName,namespace),
      payment: getEnabledPaymentMethodsCommand(podName,namespace)
    };

    const [prodOut, orderOut, coupOut, payOut] = await Promise.all([
      executeCommand(commands.products),
      executeCommand(commands.orders),
      executeCommand(commands.coupons),
      executeCommand(commands.payment)
    ]);

  
    const cleanOutput = (output) => {
      try {
        const sanitized = output.trim();
        if (!sanitized) return [];
        return JSON.parse(sanitized);
      } catch (e) {
        console.error("Parsing error:", e.message);
        return [];
      }
    };
    const auditData = {
        products: cleanOutput(prodOut),
        orders: cleanOutput(orderOut),
        coupons: cleanOutput(coupOut),
        payments: cleanOutput(payOut),
        summary: {
            totalProducts: cleanOutput(prodOut).length,
            totalOrders: cleanOutput(orderOut).length,
            totalCoupons: cleanOutput(coupOut).length,
            isCodEnabled: cleanOutput(payOut).some(p => p.id === 'cod' && p.enabled === true)
        }
    };

    return { success: true, audit: auditData };

  } catch (error) {
    console.error("[Audit] Error:", error.message);
    return { success: false, error: error.message };
  }
};