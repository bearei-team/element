type DebouncedFunction<T extends (...args: unknown[]) => unknown> = (
    ...args: Parameters<T>
) => void;

export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    delay: number,
): DebouncedFunction<T> => {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};
