export const PORT = process.env.PORT;
export const MONGO_URI = process.env.MONGO_URI;
export const JWT_SECRET=process.env.JWT_SECRET;
export const BASE_DOMAIN =  process.env.BASE_DOMAIN || "localhost";
export const NODE_ENV = process.env.NODE_ENV || "DEVELOPMENT"
export const PROTOCOL = NODE_ENV ===  "DEVELOPMENT" ? "http://" : "https://";
export const SCHEME = NODE_ENV ===  "DEVELOPMENT" ? "http" : "https";
