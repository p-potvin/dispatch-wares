export const redactPII = (data) => {
    if (!data) return data;
    const cloned = JSON.parse(JSON.stringify(data));
    const mask = (str) => str?.replace(/^\d+/, '***');
    if (cloned.destAddress) cloned.destAddress = mask(cloned.destAddress);
    return cloned;
};