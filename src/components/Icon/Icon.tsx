import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {Container} from './Icon.styles';
import {IconBase, RenderProps} from './IconBase';
import {filled} from './icons/filled';

export type IconCategory = 'image';
export type IconName = keyof (typeof filled)['image'];
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';

export interface IconProps
    extends Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View>> {
    category?: IconCategory;
    height?: number;
    name?: IconName;
    type?: IconType;
    width?: number;
}

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, renderStyle, style, children} = renderProps;
        const {height, width} = renderStyle;

        return (
            <Container
                accessibilityRole="image"
                height={height}
                ref={ref}
                style={style}
                testID={`icon--${id}`}
                width={width}>
                {children}
            </Container>
        );
    };

    return <IconBase {...props} render={render} />;
});

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
