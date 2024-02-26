import {FC, RefObject, useId, useRef} from 'react';
import {ScaledSize, View, useWindowDimensions} from 'react-native';
import {SearchProps} from './Search';

export interface RenderProps extends SearchProps {
    containerCurrent: View | null;
    containerRef: RefObject<View>;
    windowDimensions: ScaledSize;
}

export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const SearchBase: FC<SearchBaseProps> = ({render, ...renderProps}) => {
    const containerRef = useRef<View>(null);
    const id = useId();
    const windowDimensions = useWindowDimensions();

    return render({
        ...renderProps,
        containerCurrent: containerRef.current,
        containerRef,
        id,
        windowDimensions,
    });
};
