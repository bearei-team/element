import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'link' | 'outlined' | 'text' | 'tonal';

export interface ButtonProps extends TouchableRippleProps {
    block?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    type?: ButtonType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    block,
    defaultElevation,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onContentLayout,
    onEvent,
    renderStyle,
    style,
    type,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, color, height, width, contentWidth, contentHeight, ...border} =
        renderStyle;

    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const link = type === 'link';
    const shape = link ? 'extraSmall' : 'full';
    const hoveredLayout = {
        height: height || contentHeight,
        width: width || contentWidth,
    };

    return (
        <Container
            accessibilityLabel={labelText}
            accessibilityRole="button"
            block={block}
            onLayout={onLayout}
            testID={`button--${id}`}
            width={contentWidth}>
            <Elevation defaultLevel={defaultElevation} level={elevation} shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <AnimatedContent
                        {...contentProps}
                        iconShow={!!icon}
                        onLayout={onContentLayout}
                        shape={shape}
                        style={{
                            ...(typeof style === 'object' && style),
                            ...border,
                            backgroundColor,
                        }}
                        testID={`button__content--${id}`}
                        type={type}
                        block={block}
                        width={width}>
                        {icon && !link && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}

                        <AnimatedLabelText
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            size={link ? 'small' : 'large'}
                            style={{color}}
                            testID={`button__labelText--${id}`}
                            type={link ? 'body' : 'label'}>
                            {labelText}
                        </AnimatedLabelText>

                        <Hovered
                            eventName={eventName}
                            height={hoveredLayout.height}
                            shape={shape}
                            underlayColor={underlayColor}
                            width={hoveredLayout.width}
                        />
                    </AnimatedContent>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => (
    <ButtonBase {...props} ref={ref} render={render} />
));

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
