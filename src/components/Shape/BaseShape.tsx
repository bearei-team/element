import {FC, useId} from 'react';
import {ShapeProps} from './shape';

export type RenderProps = ShapeProps;
export interface BaseShapeProps extends ShapeProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseShape: FC<BaseShapeProps> = ({render, ...args}): React.JSX.Element => {
    const id = useId();
    const shape = render({...args, id});

    return shape;
};
