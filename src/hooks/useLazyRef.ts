import {useRef} from 'react';

export const useLazyRef = <T>(callback: () => T) => {
    const lazyRef = useRef<T | undefined>();

    if (lazyRef.current === undefined) {
        lazyRef.current = callback();
    }

    // useEffect(() => {
    //     lazyRef.current = callback();
    // }, [callback, dependencies]);

    return [lazyRef as React.MutableRefObject<T>];
};
