import { BASE_DOMAIN } from "../config/env.js";

export const getStoreDomain = (namespace,customPrefix) => {
    const isCustomPrefix = customPrefix && customPrefix.trim() !== "";
    const prefix = isCustomPrefix ? customPrefix : `${namespace}`;

    const baseDomain = BASE_DOMAIN;
    const domain = `${prefix}.${baseDomain}`;

    return domain;
}