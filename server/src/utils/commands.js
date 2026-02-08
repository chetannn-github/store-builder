import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




export const getStoreCreationCommand = (namespace, storeType, domain, email, password) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const ingressClass = isProduction ? "traefik" : "nginx"; 
    const chartFolder = (storeType === "medusa") ? "medusa" : "storefront"; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);
    const releaseName = namespace;
    const baseDomain = process.env.BASE_DOMAIN || "localhost";
    const domain = `store-${storeName}.${baseDomain}`;

    
    const adminEmail = email || "admin@default.com";
    const adminPass = password || "secret123";

   

    const storeCreationCommand = `helm install ${releaseName} ${chartPath} \
    --namespace ${namespace} \
    --create-namespace \
    --set ingress.className="${ingressClass}" \
    --set ingress.host="${domain}" \
    --set wordpress.siteUrl="http://${domain}" \
    --set service.type="ClusterIP" \
    --set store.type=${storeType} \
    --wait`;

    if (storeType === "medusa") {
      storeCreationCommand += ` \
      --set adminUser.email="${adminEmail}" \
      --set adminUser.password="${adminPass}"`;
    }


    return storeCreationCommand;
}


export const getStoreDeletionCommand = (namespace) => {
    const deletionCommand = `kubectl delete namespace ${namespace} --wait=false`; 
    return deletionCommand;
}