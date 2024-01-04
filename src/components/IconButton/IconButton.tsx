import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon} from './IconButton.styles';
import {IconButtonBase, RenderProps} from './IconButtonBase';

export type IconButtonType = 'filled' | 'outlined' | 'standard' | 'tonal';

export interface IconButtonProps extends TouchableRippleProps {
    icon?: React.JSX.Element;
    type?: IconButtonType;
}

/**
 * TODO: Selected
 */
const AnimatedContent = Animated.createAnimatedComponent(Content);
const ForwardRefButton = forwardRef<View, IconButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            eventName,
            icon,
            id,
            onEvent,
            renderStyle,
            type,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {backgroundColor, height, width, ...border} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const shape = 'full';

        return (
            <Container
                {...containerProps}
                accessibilityRole="button"
                testID={`button--${id}`}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <AnimatedContent
                        iconShow={!!icon}
                        onLayout={onLayout}
                        shape={shape}
                        style={{backgroundColor, ...border}}
                        testID={`button__content--${id}`}
                        type={type}>
                        <Icon testID={`button__icon--${id}`}>{icon}</Icon>

                        <Hovered
                            eventName={eventName}
                            height={height}
                            shape={shape}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    </AnimatedContent>
                </TouchableRipple>
            </Container>
        );
    };

    return <IconButtonBase {...props} render={render} ref={ref} />;
});

export const IconButton: FC<IconButtonProps> = memo(ForwardRefButton);
