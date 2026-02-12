import path from "path";
import { fileURLToPath } from "url";
import { BASE_DOMAIN, NODE_ENV } from "../config/env.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getStoreCreationCommand = (namespace, storeType, domain, adminEmail, adminPass,slug) => {
    const chartFolder = (storeType === "medusa") ? "medusa" : "storefront"; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);
    const ingressClass = "nginx";

    return storeType === "medusa" ?  
    getMedusaStoreCommand(adminEmail, adminPass, namespace, chartPath,slug ) :
    getWoocommerceStoreCommand(adminEmail,adminPass,namespace,chartPath,storeType,domain,ingressClass) ;
   
}


export const getStoreDeletionCommand = (namespace) => {
    const deletionCommand = `kubectl delete namespace ${namespace} --wait=false`; 
    return deletionCommand;
}


const getWoocommerceStoreCommand = (email, password, namespace, chartPath,storeType,domain, ingressClass ) => {
  const myCustomImage = "chetannn/custom-store-builder"; 
  const imageTag = "v1";

  const devPostStartScript = `
    echo "Waiting for WordPress to initialize...";
    sleep 30;
    wp plugin activate woocommerce;
    echo "WooCommerce Activated!";
  `;

  const prodPostStartScript = "echo Waiting-for-WP...; sleep 30; wp plugin activate woocommerce; echo Activated!;";
  const postStartScript = NODE_ENV === 'production' ? prodPostStartScript : devPostStartScript;

  const storeCreationCommand = `helm install ${namespace} ${chartPath} \
      --namespace ${namespace} \
      --create-namespace \
      \
      --set image.registry=docker.io \
      --set image.repository="${myCustomImage}" \
      --set image.tag="${imageTag}" \
      --set image.pullPolicy=Always \
      \
      --set service.type=ClusterIP \
      --set service.port=80 \
      \
      --set store.type=${storeType} \
      --set store.port=8080 \
      \
      --set wordpressUsername="admin" \
      --set wordpressPassword="${password}" \
      --set wordpressEmail="${email}" \
      --set wordpressFirstName="Store" \
      --set wordpressLastName="Owner" \
      \
      --set ingress.enabled=true \
      --set ingress.host=${domain} \
      --set ingress.className=${ingressClass} \
      \
      --set livenessProbe.initialDelaySeconds=60 \
      --set readinessProbe.initialDelaySeconds=60 \
      \
      --set lifecycleHooks.postStart.exec.command[0]="/bin/bash" \
      --set lifecycleHooks.postStart.exec.command[1]="-c" \
      --set lifecycleHooks.postStart.exec.command[2]='${postStartScript}' \
      \
      --values ${chartPath}/values-local.yaml \
      --wait`;

  return storeCreationCommand;
}

const getMedusaStoreCommand = (adminEmail, adminPass, namespace, chartPath,slug ) => {
    

      const medusaStoreCommand = `helm install ${namespace} ${chartPath} \
      --namespace ${namespace} \
      --create-namespace \
      --set slug=${slug} \
      --set domain=${BASE_DOMAIN} \
      --set ingress.className="nginx" \
      --set adminUser.email="${adminEmail}" \
      --set adminUser.password="${adminPass}" \
      --values ${chartPath}/values-local.yaml \
      --wait`;

    return medusaStoreCommand;
}