import React, {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Container} from './Icon.styles';
import {IconBase, IconProps, RenderProps} from './IconBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, children, style, ...containerProps}: RenderProps) => {
    const {height, width, ...containerStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            accessibilityRole="image"
            style={{
                ...(typeof style === 'object' && style),
                ...containerStyle,
            }}
            testID={`icon--${id}`}
            renderStyle={{height, width}}>
            {children}
        </AnimatedContainer>
    );
};

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => (
    <IconBase {...props} ref={ref} render={render} />
));

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
export type {IconProps};
