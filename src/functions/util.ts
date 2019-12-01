export const getMissingParams = (params: { [key: string]: any }): string[] => {
    return Object.keys(params).filter(a => !params[a]);
};