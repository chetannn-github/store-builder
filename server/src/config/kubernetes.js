import * as k8s from '@kubernetes/client-node';

const kc = new k8s.KubeConfig();

try {
  kc.loadFromDefault();
  const cluster = kc.getCurrentCluster();
  
  if (cluster) {
      cluster.skipTLSVerify = true;
      
      console.log(`Connecting to Kubernetes Cluster: ${cluster.server}`);
  } else {
      console.warn("No cluster found in config, falling back to localhost");
      kc.addCluster({
          name: 'default',
          server: 'http://localhost:8080', 
          skipTLSVerify: true
      });
  }
  console.log(' Kubernetes client initialized');
} catch (error) {
  console.error(' Kubernetes client initialization failed:', error.message);
}


export const coreApi = kc.makeApiClient(k8s.CoreV1Api);
export const appsApi = kc.makeApiClient(k8s.AppsV1Api);
export const networkingApi = kc.makeApiClient(k8s.NetworkingV1Api);

export default kc;