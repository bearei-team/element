export const omit = <T extends Record<string, unknown>, K extends keyof T>(
    object: T,
    keys: K[]
) => {
    const result = {...object}

    keys.forEach(key => {
        if (key in result) {
            delete result[key]
        }
    })

    return result
}
