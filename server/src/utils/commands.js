import path from "path";
import { fileURLToPath } from "url";
import { BASE_DOMAIN, NODE_ENV, PROTOCOL, SCHEME } from "../config/env.js";
import { INGRESS_CLASS, MEDUSA_STORE_ADMIN_FOLDER, MEDUSA_STORE_FOLDER, WOOCOMMERCE_FOLDER, WOOCOMMERCE_IMAGE, WOOCOMMERCE_IMAGE_TAG } from "../config/helm.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getStoreCreationCommand = (namespace, storeType, domain, adminEmail, adminPass,slug) => {
    const chartFolder = (storeType === "medusa") ? MEDUSA_STORE_ADMIN_FOLDER : WOOCOMMERCE_FOLDER; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);

    return storeType === "medusa" ?  
    getMedusaAdminStoreCommand(adminEmail, adminPass, namespace, chartPath,slug ) :
    getWoocommerceStoreCommand(adminEmail,adminPass,namespace,chartPath,storeType,domain) ;
   
}

export const getCustomDomainCommand = (store) => { 
    const chartFolder = (store.storeType === "medusa") ? MEDUSA_STORE_ADMIN_FOLDER : WOOCOMMERCE_FOLDER; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);

    const helmCommand = `helm upgrade ${store.namespace} ${chartPath} \
    --namespace ${store.namespace} \
    --reuse-values \
    --set ingress.customDomain="${store.customDomain}" \
    --set ingress.tls.enabled=true \
    --wait`;

    return helmCommand;
}


export const getStoreNamespaceDeletionCommand = (namespace) => {
    const deletionCommand = `kubectl delete namespace ${namespace} --wait=false`; 
    return deletionCommand;
}

export const getStoreNamespaceCreationCommand = (namespace) => {
    const creationCommand = `kubectl create namespace ${namespace} && kubectl label namespace ${namespace} managedBy=urumi-platform`; 
    return creationCommand;
}


const getWoocommerceStoreCommand = (adminEmail, adminPass, namespace, chartPath,storeType,domain) => {
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
      --set image.repository="${WOOCOMMERCE_IMAGE}" \
      --set image.tag="${WOOCOMMERCE_IMAGE_TAG}" \
      --set image.pullPolicy=Always \
      \
      --set service.type=ClusterIP \
      --set service.port=80 \
      \
      --set store.type=${storeType} \
      --set store.port=8080 \
      \
      --set wordpressUsername="admin" \
      --set wordpressPassword="${adminPass}" \
      --set wordpressEmail="${adminEmail}" \
      --set wordpressFirstName="Store" \
      --set wordpressLastName="Owner" \
      \
      --set ingress.enabled=true \
      --set ingress.host=${domain} \
      --set ingress.className=${INGRESS_CLASS} \
      --set ingress.protocol=${PROTOCOL} \
      --set ingress.scheme=${SCHEME} \
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

const getMedusaAdminStoreCommand = (adminEmail, adminPass, namespace, chartPath,slug ) => {
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



export const getMedusaStoreCommand = (namespace, slug, domain, backendUrl, publishableKey) => {
    const releaseName = `front-${slug}`; 
    const chartFolder = MEDUSA_STORE_FOLDER; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);

    const command = `helm upgrade --install ${releaseName} ${chartPath} \
    --namespace ${namespace} \
    --set slug="${slug}" \
    --set domain="${BASE_DOMAIN}" \
    --set backendUrl="${backendUrl}" \
    --set publishableKey="${publishableKey}" \
    --wait`;

    return command;
};