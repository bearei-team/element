import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Container} from './Icon.styles';
import {IconBase, RenderProps} from './IconBase';

export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';
export interface IconProps
    extends Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View>> {
    type?: IconType;
    icon?: React.JSX.Element;
    width?: number;
    height?: number;
}

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => {
    const render = ({id, renderStyle, style, children}: RenderProps) => {
        const {height, width} = renderStyle;

        return (
            <Container height={height} ref={ref} testID={`icon--${id}`} width={width} style={style}>
                {children}
            </Container>
        );
    };

    return <IconBase {...props} render={render} />;
});

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
