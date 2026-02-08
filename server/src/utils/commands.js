import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const getStoreCreationCommand = (namespace, storeType, domain, email, password) => {
    
    const chartFolder = (storeType === "medusa") ? "medusa" : "storefront"; 
    const chartPath = path.resolve(__dirname, `../charts/${chartFolder}`);
    const releaseName = namespace;

    const adminEmail = email || "admin@default.com";
    const adminPass = password || "secret123";

    let storeCreationCommand = `helm install ${releaseName} ${chartPath} \
      --namespace ${namespace} \
      --create-namespace \
      --set ingress.host=${domain} \
      --set store.type=${storeType} \
      --values ${chartPath}/values-local.yaml \
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