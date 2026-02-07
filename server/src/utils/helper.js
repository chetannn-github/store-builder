export const getStoreDomain = (namespace,customDomain) => {
    const isCustom = customDomain && customDomain.trim() !== "";
    const domain = isCustom ? customDomain : `${namespace}.localhost`;

    return {domain , isCustom};
}