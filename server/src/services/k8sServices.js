import { exec } from 'child_process';
import util from 'util';
import { coreApi } from '../config/kubernetes.js';
import { getStoreCreationCommand, getStoreDeletionCommand } from '../utils/commands.js';

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



export const deployStoreHelmChart = async (namespace, storeName, storeType, domain) => {
  try {
    console.log(`[Helm] Deploying ${storeType} for ${storeName}...`);
    const command = getStoreCreationCommand(namespace,storeType,domain);
    const { stdout, stderr } = await execPromise(command);

    console.log(`[Helm] Success: ${stdout}`);
    return true;

  } catch (error) {
    console.error(`[Helm] Error: ${error.stderr || error.message}`);
    throw new Error(`Helm installation failed: ${error.message}`);
  }
};



export const deleteStoreResources = async (namespace) => {
  try {
    console.log(`[K8s] Deleting namespace: ${namespace}...`);
    const command = getStoreDeletionCommand(namespace);
  
    await execPromise(command);
    
    console.log(`[K8s] Delete command issued for ${namespace}`);
    return true;

  } catch (error) {
    if (error.stderr && error.stderr.includes("not found")) {
      console.log(`[K8s] Namespace ${namespace} already deleted.`);
      return true;
    }
    
    console.error(`[K8s] Delete Error:`, error.message);
    throw error;
  }
};