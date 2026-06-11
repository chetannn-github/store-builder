export const createProductCommand = (podName,namespace,productData) => {
    const cmd = `kubectl exec ${podName} -n ${namespace} -- wp wc product create --name="${productData.name}" --regular_price="${productData.price}" --user=1 --allow-root`;
    return cmd;
}

export const getAllProductCommand = (podName,namespace) => {
    const field = ['id', 'name', 'status', 'price', 'regular_price', 'permalink'].join(',');
    const cmd = `kubectl exec ${podName} -n ${namespace} -- wp wc product list --user=1 --fields=${field} --format=json --allow-root`;
    return cmd
}

export const getPodsCommand = (namespace) => {
    return `kubectl get pods -n ${namespace} -l app=${namespace} -o json`;
}
   
export const getEnableCODCommand = (podName, namespace) => {
    return `kubectl exec ${podName} -n ${namespace} -- wp wc payment_gateway update cod --enabled=true --user=1 --allow-root`;
};

export const getEnabledPaymentMethodsCommand = (podName, namespace) => {
  return `kubectl exec ${podName} -n ${namespace} -- wp wc payment_gateway list --user=1 --fields=id,enabled --format=json --allow-root`;
}

export const createCouponCommand = (podName,namespace,code,amount,type) => {
    const cmd = `kubectl exec ${podName} -n ${namespace} -- wp wc shop_coupon create --code="${code}" --amount="${amount}" --discount_type="${type}" --user=1 --allow-root`;
    return cmd;
}

export const getAllCouponsCommand = (podName,namespace) => {
    return `kubectl exec ${podName} -n ${namespace} -- wp wc shop_coupon list --user=1 --fields=id,code,amount,discount_type --format=json --allow-root`;
}

export const getCouponDeletionCommand = (podName,namespace,couponId) => {
   return `kubectl exec ${podName} -n ${namespace} -- wp wc shop_coupon delete ${couponId} --force=true --user=1 --allow-root`;
}

export const getAllOrdersCommand = (podName,namespace) => {
    const cmd = `kubectl exec ${podName} -n ${namespace} -- wp wc shop_order list --user=1 --fields=id,status,total,customer_id --format=json --allow-root`;
    return cmd;
}