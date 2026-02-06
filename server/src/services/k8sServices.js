import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import { coreApi } from '../config/kubernetes.js';
import { fileURLToPath } from 'url';

const execPromise = util.promisify(exec);

export const createK8sNamespace = async (namespaceName) => {
  try {
    console.log(`Creating namespace: ${namespaceName}`);
    
    await coreApi.createNamespace({ body : {
        metadata: {
        name: namespaceName,
        labels: { managedBy: "urumi-platform" }
      }
    }});
    
    return true;
  } catch (error) {
    if (error.response && error.response.statusCode === 409) {
      console.log(`Namespace ${namespaceName} already exists.`);
      return true;
    }
    throw error;
  }
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const deployStoreHelmChart = async (namespace, storeName, storeType, domain) => {
  try {
    console.log(`[Helm] Deploying ${storeType} for ${storeName}...`);

   
   const chartPath = path.resolve(__dirname, '../charts/storefront');
    const releaseName = namespace;

    
    const command = `helm install ${releaseName} ${chartPath} \
      --namespace ${namespace} \
      --set ingress.host=${domain} \
      --set store.type=${storeType} \
      --values ${chartPath}/values-local.yaml \
      --wait`;

    const { stdout, stderr } = await execPromise(command);
    
    console.log(`[Helm] Success: ${stdout}`);
    return true;

  } catch (error) {
    console.error(`[Helm] Error: ${error.stderr || error.message}`);
    throw new Error(`Helm installation failed: ${error.message}`);
  }
};