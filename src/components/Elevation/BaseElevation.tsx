import {FC, useId} from 'react';
import {ElevationProps} from './Elevation';

export type RenderProps = ElevationProps;

export interface BaseElevationProps extends ElevationProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseElevation: FC<BaseElevationProps> = ({level, render, ...renderProps}) => {
    const id = useId();
    const elevation = render({
        ...renderProps,
        id,
        level,
    });

    return elevation;
};
