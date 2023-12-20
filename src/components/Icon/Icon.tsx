import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {State} from '../Common/interface';
import {Container} from './Icon.styles';
import {IconBase, RenderProps} from './IconBase';
import {filled} from './icons/filled';

export type IconCategory = 'image';
export type IconName = keyof (typeof filled)['image'];
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';

export interface IconProps
    extends Partial<
        Omit<SvgProps, 'width' | 'height'> & RefAttributes<View> & ViewProps
    > {
    category?: IconCategory;
    height?: number;
    name?: IconName;
    state?: State;
    type?: IconType;
    width?: number;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, renderStyle, children, style, ...containerProps} =
            renderProps;

        const {height, width, ...containerStyle} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                accessibilityRole="image"
                height={height}
                ref={ref}
                style={{
                    ...(typeof style === 'object' && style),
                    ...containerStyle,
                }}
                testID={`icon--${id}`}
                width={width}>
                {children}
            </AnimatedContainer>
        );
    };

    return <IconBase {...props} render={render} />;
});

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
