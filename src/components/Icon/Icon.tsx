import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import Animated from 'react-native-reanimated';
import {Container} from './Icon.styles';
import {IconBase, IconName, IconProps, IconType, RenderProps} from './IconBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({id, renderStyle, children, style, ...containerProps}: RenderProps) => {
    const {height, width, animatedStyle} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            accessibilityRole="image"
            renderStyle={{height, width}}
            style={[style, animatedStyle]}
            testID={`icon--${id}`}>
            {children}
        </AnimatedContainer>
    );
};

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => (
    <IconBase {...props} ref={ref} render={render} />
));

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
export type {IconName, IconProps, IconType};
