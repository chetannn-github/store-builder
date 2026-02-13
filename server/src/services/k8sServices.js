import { exec } from 'child_process';
import util from 'util';
import { coreApi } from '../config/kubernetes.js';

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
    
  
  } catch (error) {
    if (error.response && error.response.statusCode === 409) {
      console.log(`Namespace ${namespaceName} already exists.`);
    }
    throw error;
  }
};


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