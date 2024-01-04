import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType =
    | 'elevated'
    | 'filled'
    | 'link'
    | 'outlined'
    | 'text'
    | 'tonal';

export interface ButtonProps extends TouchableRippleProps {
    block?: boolean;
    elevation?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    type?: ButtonType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            block,
            id,
            type,
            renderStyle,
            labelText,
            onEvent,
            icon,
            shape,
            eventName,
            underlayColor,
            elevationLevel,
        } = renderProps;

        const {backgroundColor, color, height, width, ...border} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;

        return (
            <Container
                accessibilityLabel={labelText}
                accessibilityRole="button"
                block={block}
                testID={`button--${id}`}>
                <Elevation level={elevationLevel} shape={shape}>
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
                            {icon && (
                                <Icon testID={`button__icon--${id}`}>
                                    {icon}
                                </Icon>
                            )}

                            <AnimatedLabelText
                                size="large"
                                style={{color}}
                                type="label">
                                {labelText}
                            </AnimatedLabelText>

                            <Hovered
                                eventName={eventName}
                                height={height}
                                shape={shape}
                                underlayColor={underlayColor}
                                width={width}
                            />
                        </AnimatedContent>
                    </TouchableRipple>
                </Elevation>
            </Container>
        );
    };

    return <ButtonBase {...props} render={render} ref={ref} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
