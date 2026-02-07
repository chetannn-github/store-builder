export const getStoreDomain = (namespace,customDomain) => {
    const isCustom = customDomain && customDomain.trim() !== "";
    const domain = isCustom ? customDomain : `${namespace}.localhost`;

    console.log(customDomain, domain)
    return {domain , isCustom};
}