import k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();


kc.loadFromDefault();

const coreV1 = kc.makeApiClient(k8s.CoreV1Api);


export const createNamespace = async (name) => {
  try {
    await coreV1.createNamespace({
      metadata: {
        name,
        labels: {
          "managed-by": "store-platform"
        }
      }
    });

    console.log(`Namespace created: ${name}`);
  } catch (err) {
    if (err.response?.statusCode === 409) {
      console.log(`Namespace already exists: ${name}`);
      return;
    }
    throw err;
  }
};


export const deleteNamespace = async (name) => {
  try {
    await coreV1.deleteNamespace(name);
    console.log(`Namespace delete initiated: ${name}`);
  } catch (err) {
    if (err.response?.statusCode === 404) return;
    throw err;
  }
};
