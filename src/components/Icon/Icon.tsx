import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, View, ViewProps} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {EventName} from '../Common/interface';
import {Container} from './Icon.styles';
import {IconBase, RenderProps} from './IconBase';
import {filled} from './icons/filled';

export type IconName = keyof (typeof filled)['svg'];
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';
export interface IconProps
    extends Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View> & ViewProps> {
    eventName?: EventName;
    height?: number;
    name?: IconName;
    type?: IconType;
    width?: number;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, children, style, ...containerProps}: RenderProps) => {
    const {height, width, ...containerStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            accessibilityRole="image"
            height={height}
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

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => (
    <IconBase {...props} ref={ref} render={render} />
));

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
