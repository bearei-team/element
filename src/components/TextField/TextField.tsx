import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, PressableProps, TextInput, TextInputProps} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Hovered} from '../Hovered/Hovered';
import {
    ActiveIndicator,
    Container,
    Content,
    Header,
    HeaderInner,
    Inner,
    LabelText,
    Leading,
    SupportingText,
    Trailing,
} from './TextField.styles';
import {RenderProps, TextFieldBase} from './TextFieldBase';

export type TextFieldType = 'filled' | 'outlined';
export type InputProps = Partial<
    TextInputProps & PressableProps & RefAttributes<TextInput> & Pick<ShapeProps, 'shape'>
>;

export interface TextFieldProps extends InputProps {
    disabled?: boolean;
    error?: boolean;
    labelText?: string;
    leading?: React.JSX.Element;
    supportingText?: string;
    trailing?: React.JSX.Element;
    type?: TextFieldType;
}

const AnimatedHeaderInner = Animated.createAnimatedComponent(HeaderInner);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
const render = ({
    error,
    supportingText,
    id,
    onEvent,
    labelText,
    leading,
    trailing,
    input,
    renderStyle,
    underlayColor,
    eventName,
}: RenderProps) => {
    const {
        activeIndicatorBackgroundColor,
        supportingTextColor,
        activeIndicatorScale,
        backgroundColor,
        labelTextColor,
        labelTextHeight,
        labelTextLineHeight,
        labelTextSize,
        labelTextTop,
        labelTextLetterSpacing,
        width,
        height,
    } = renderStyle;
    const shape = 'extraSmallTop';
    const leadingShow = !!leading;

    return (
        <Container
            {...(error && {
                accessibilityLabel: supportingText,
                accessibilityRole: 'alert',
            })}
            testID={`textfield--${id}`}>
            <Inner testID={`textfield__inner--${id}`}>
                <Header
                    {...onEvent}
                    {...(!error && {
                        accessibilityLabel: labelText,
                        accessibilityRole: 'keyboardkey',
                    })}
                    testID={`textfield__header--${id}`}>
                    <AnimatedHeaderInner
                        shape={shape}
                        testID={`textfield__headerInner--${id}`}
                        leadingShow={leadingShow}
                        trailingShow={!!trailing}
                        style={{backgroundColor}}>
                        {leading && (
                            <Leading testID={`textfield__leading--${id}`}>{leading}</Leading>
                        )}

                        <Content testID={`textfield__content--${id}`}>{input}</Content>

                        {trailing && (
                            <Trailing testID={`textfield__trailing--${id}`}>{trailing}</Trailing>
                        )}

                        <AnimatedLabelText
                            testID={`textField__labelText--${id}`}
                            type="body"
                            size="large"
                            leadingShow={leadingShow}
                            style={{
                                color: labelTextColor,
                                top: labelTextTop,
                                fontSize: labelTextSize,
                                height: labelTextHeight,
                                lineHeight: labelTextLineHeight,
                                letterSpacing: labelTextLetterSpacing,
                            }}>
                            {labelText}
                        </AnimatedLabelText>

                        <AnimatedActiveIndicator
                            testID={`textfield__activeIndicator--${id}`}
                            width={width}
                            style={{
                                backgroundColor: activeIndicatorBackgroundColor,
                                transform: [{scaleY: activeIndicatorScale}],
                            }}
                        />

                        <Hovered
                            height={height}
                            shape={shape}
                            eventName={eventName}
                            underlayColor={underlayColor}
                            width={width}
                            opacities={[0, 0.08]}
                        />
                    </AnimatedHeaderInner>
                </Header>

                <AnimatedSupportingText
                    type="body"
                    size="small"
                    style={{color: supportingTextColor}}>
                    {supportingText}
                </AnimatedSupportingText>
            </Inner>
        </Container>
    );
};

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => (
    <TextFieldBase {...props} ref={ref} render={render} />
));

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
