import {FC, RefAttributes, useId} from 'react';
import {View, ViewProps} from 'react-native';
import {Layout, Size} from '../Common/interface';

export interface DividerProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: Layout;
    renderStyle?: {width?: number; height?: number};
    size?: Size;
    subheader?: string;
}

export type RenderProps = DividerProps;
export interface DividerBaseProps extends DividerProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const DividerBase: FC<DividerBaseProps> = ({
    layout,
    render,
    size,
    subheader,
    ...renderProps
}) => {
    const id = useId();

    return render({
        ...renderProps,
        id,
        layout,
        size: subheader && layout === 'horizontal' ? 'small' : size,
        subheader,
    });
};
