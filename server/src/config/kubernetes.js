import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();

try {
  if (process.env.NODE_ENV === 'production') kc.loadFromCluster();
  else kc.loadFromDefault();
  
  console.log(' Kubernetes client initialized');
} catch (error) {
  console.error('Kubernetes client initialization failed:', error.message);
  console.log(' Make sure minikube is running: minikube start');
}


export const coreApi = kc.makeApiClient(k8s.CoreV1Api);
export const appsApi = kc.makeApiClient(k8s.AppsV1Api);
export const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

export default kc;