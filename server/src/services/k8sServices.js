import { exec } from 'child_process';
import util from 'util';
import { getCustomDomainCommand, getMedusaStoreCommand, getStoreCreationCommand, getStoreNamespaceCreationCommand, getStoreNamespaceDeletionCommand } from '../utils/commands.js';
import { getPodsCommand } from '../utils/woocommerceCommands.js';

const execPromise = util.promisify(exec);


export const executeCommand = async(command) => {
  try {
    console.log(`[Helm] Deploying`);
    const { stdout } = await execPromise(command);
    // console.log(`[Helm] Success: ${stdout}`);
    return stdout;
  } catch (error) {
    console.error(`[Helm] Error: ${error.stderr || error.message}`);
    throw new Error(`Helm installation failed: ${error.message}`);
  }
}


export const createNameSpaceAndBuildStore = async(namespace, storeType, domain,adminEmail, adminPassword, slug) => {
  console.log(`[Background] Starting deployment for (${namespace})...`);
  const namespaceCreationCommand = getStoreNamespaceCreationCommand(namespace);
  await executeCommand(namespaceCreationCommand);
  const command = getStoreCreationCommand(namespace,storeType,domain,adminEmail,adminPassword,slug);
  await executeCommand(command);
  console.log(`[Background] Store ${namespace} is now READY!`);

}

export const deleteNameSpace = async(namespace) => {
  console.log(`[Background] Deleting resources for namespace: ${namespace}...`);
  const command = getStoreNamespaceDeletionCommand(namespace);
  await executeCommand(command);
  console.log(`[Background] Store ${namespace} deleted successfully from DB & K8s`);
}

export const deployMedusaStoreFront = async(namespace,slug,domain,backendUrl, publishableKey) => {
  console.log(`[Background] Starting Storefront for: ${slug}...`);
  const command = getMedusaStoreCommand(namespace,slug,domain,backendUrl, publishableKey);
  await executeCommand(command);
  console.log(`[Background] Storefront ${slug} is now READY!`);
}



export const updateCustomDomain = async(store) => {
    const command = getCustomDomainCommand(store);
    await executeCommand(command);
    console.log(`Domain ${store.customDomain} is now ACTIVE`);
}

export const getPodName = async (namespace) => {
  try {
    const cmd = getPodsCommand(namespace);
    const stdout  = await executeCommand(cmd);
    const podData = JSON.parse(stdout);

    const activePod = podData.items.find(pod => 
      pod.status.phase === "Running" && 
      !pod.metadata.name.includes("-db")
    );

    if (!activePod) {
      console.error(`[Discovery] No running WordPress pod found in ${namespace}`);
      return null;
    }

    const podName = activePod.metadata.name;
    console.log(`[Discovery] Found active pod: ${podName}`);
    return podName;

  } catch (error) {
    console.error("[Discovery] Error fetching pod:", error.message);
    return null;
  }
};