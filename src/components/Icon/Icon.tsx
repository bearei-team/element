import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {State} from '../Common/interface';
import {Container} from './Icon.styles';
import {IconBase, RenderProps} from './IconBase';
import {filled} from './icons/filled';

export type IconCategory = 'image';
export type IconName = keyof (typeof filled)['image'];
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';

export interface IconProps
    extends Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View> & PressableProps> {
    category?: IconCategory;
    height?: number;
    name?: IconName;
    type?: IconType;
    width?: number;
    state?: State;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, renderStyle, children, ...containerProps} = renderProps;
        const {height, width, transform} = renderStyle;

        return (
            <AnimatedContainer
                {...containerProps}
                accessibilityRole="image"
                height={height}
                ref={ref}
                testID={`icon--${id}`}
                width={width}
                style={{transform}}>
                {children}
            </AnimatedContainer>
        );
    };

    return <IconBase {...props} render={render} />;
});

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
