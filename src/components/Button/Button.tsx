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
            elevation,
            eventName,
            icon,
            id,
            labelText,
            onEvent,
            renderStyle,
            type,
            underlayColor,
            defaultElevation,
            ...containerProps
        } = renderProps;

        const {backgroundColor, color, height, width, ...border} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const link = type === 'link';
        const shape = link ? 'none' : 'full';

        return (
            <Container
                {...containerProps}
                accessibilityLabel={labelText}
                accessibilityRole="button"
                block={block}
                testID={`button--${id}`}
                onLayout={onLayout}>
                <Elevation
                    defaultLevel={defaultElevation}
                    level={elevation}
                    shape={shape}>
                    <TouchableRipple
                        {...onTouchableRippleEvent}
                        shape={shape}
                        underlayColor={underlayColor}>
                        <AnimatedContent
                            iconShow={!!icon}
                            shape={shape}
                            style={{backgroundColor, ...border}}
                            testID={`button__content--${id}`}
                            type={type}
                            block={block}
                            width={width}>
                            {icon && !link && (
                                <Icon testID={`button__icon--${id}`}>
                                    {icon}
                                </Icon>
                            )}

                            <AnimatedLabelText
                                size={link ? 'small' : 'large'}
                                style={{color}}
                                testID={`button__labelText--${id}`}
                                type={link ? 'body' : 'label'}>
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

    return <ButtonBase {...props} ref={ref} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
