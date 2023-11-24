import {FC, useId} from 'react';
import {SvgProps} from 'react-native-svg';
import {IconProps} from './Icon';
import {useSVGImport} from './useSVGImport';

export interface RenderProps extends IconProps {
    SvgIcon?: FC<SvgProps>;
    renderStyle: {
        height?: number;
        width?: number;
    };
}

export interface BaseDividerProps extends IconProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseIcon: FC<BaseDividerProps> = ({
    render,
    type = 'filled',
    icon = 'face',
    width,
    height,
    ...renderProps
}) => {
    const id = useId();
    const [SvgIcon] = useSVGImport({type, icon});

    return render({
        ...renderProps,
        id,
        renderStyle: {height, width},
        SvgIcon,
    });
};
