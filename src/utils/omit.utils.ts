export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T,
    keys: K[],
) => {
    const result = {...obj};

    keys.forEach(key => {
        if (key in result) {
            delete result[key];
        }
    });

    return result;
};
