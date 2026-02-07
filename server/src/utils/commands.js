import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getStoreCreationCommand = (namespace, storeType, domain) => {
    const chartPath = path.resolve(__dirname, '../charts/storefront');
    const releaseName = namespace;

    const storeCreationCommand = `helm install ${releaseName} ${chartPath} \
      --namespace ${namespace} \
      --set ingress.host=${domain} \
      --set store.type=${storeType} \
      --values ${chartPath}/values-local.yaml \
      --wait`;

    return storeCreationCommand;
}


export const getStoreDeletionCommand = (namespace) => {
    const deletionCommand = `kubectl delete namespace ${namespace} --wait=false`; 
    return deletionCommand;
}