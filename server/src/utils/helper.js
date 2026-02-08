export const getStoreDomain = (namespace,customDomain) => {
    const isCustom = customDomain && customDomain.trim() !== "";
    const domain = isCustom ? customDomain : `${namespace}`;

    return {domain , isCustom};
}