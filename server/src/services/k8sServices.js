import { exec } from 'child_process';
import util from 'util';
import { getStoreCreationCommand, getStoreNamespaceCreationCommand, getStoreNamespaceDeletionCommand } from '../utils/commands';

const execPromise = util.promisify(exec);


export const executeHelmCommand = async(command) => {
  try {
    console.log(`[Helm] Deploying`);
    const { stdout } = await execPromise(command);
    console.log(`[Helm] Success: ${stdout}`);
  } catch (error) {
    console.error(`[Helm] Error: ${error.stderr || error.message}`);
    throw new Error(`Helm installation failed: ${error.message}`);
  }
}


export const createNameSpaceAndBuildStore = async(namespace, storeType, domain,adminEmail, adminPassword, slug) => {
  console.log(`[Background] Starting deployment for (${namespace})...`);
  const namespaceCreationCommand = getStoreNamespaceCreationCommand(namespace);
  await executeHelmCommand(namespaceCreationCommand);
  const command = getStoreCreationCommand(namespace,storeType,domain,adminEmail,adminPassword,slug);
  await executeHelmCommand(command);
  console.log(`[Background] Store ${namespace} is now READY!`);

}

export const deleteNameSpace = async(namespace) => {
  console.log(`[Background] Deleting resources for namespace: ${namespace}...`);
  const command = getStoreNamespaceDeletionCommand(namespace);
  await executeHelmCommand(command);
  console.log(`[Background] Store ${namespace} deleted successfully from DB & K8s`);
}

export const deployMedusaStoreFront = async(namespace,slug,domain,backendUrl, publishableKey) => {
  console.log(`[Background] Starting Storefront for: ${slug}...`);
  const command = getMedusaStoreCommand(namespace,slug,domain,backendUrl, publishableKey);
  await executeHelmCommand(command);
  console.log(`[Background] Storefront ${slug} is now READY!`);
}