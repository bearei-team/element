import {useRef} from 'react';

export const useLazyRef = <T>(callback: () => T): React.MutableRefObject<T> => {
    const lazyRef = useRef<T | undefined>();

    if (lazyRef.current === undefined) {
        lazyRef.current = callback();
    }

    return lazyRef as React.MutableRefObject<T>;
};
