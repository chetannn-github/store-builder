import { BASE_DOMAIN, PROTOCOL } from "../config/env.js";

export const getStoreDomain = (namespace,customSlug) => {
    const isCustomPrefix = customSlug && customSlug.trim() !== "";
    const slug = isCustomPrefix ? customSlug : `${namespace}`;

    const domain = `${slug}.${BASE_DOMAIN}`;
    return domain;
}


export const getStoreAdminUrl = (storeType, slug) => {
    if(storeType === "medusa") {
        return `${PROTOCOL}admin-${slug}.${BASE_DOMAIN}/app`
    } 

    return `${PROTOCOL}${slug}.${BASE_DOMAIN}/wp-admin`
}

export const extractProductPath = (url) => {
  try {
    const parsed = new URL(url);
    let pathname = parsed.pathname;
    if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }

    return pathname;
  } catch (err) {
    return null;
  }
};