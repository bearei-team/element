import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, Pressable, TextInput, TextInputProps} from 'react-native';
import {
    ActiveIndicator,
    Container,
    Content,
    Label,
    Main,
    SupportingText,
    TrailingIcon,
    Input,
} from './TextField.styles';
import {BaseTextField, RenderProps} from './BaseTextField';
import {Hovered} from '../Hovered/Hovered';

export type Type = 'filled' | 'outlined';
export interface TextFieldProps extends Partial<TextInputProps & RefAttributes<TextInput>> {
    label?: string;
    type?: Type;
    trailingIcon?: React.JSX.Element;
    supportingText?: string;
    disabled?: boolean;
    error?: boolean;
}

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const AnimatedLabel = Animated.createAnimatedComponent(Label);
    const AnimatedTextInput = Animated.createAnimatedComponent(Input);
    const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
    const AnimatedTrailingIcon = Animated.createAnimatedComponent(TrailingIcon);
    const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);

    const render = ({
        id,
        type,
        trailingIcon,
        labelStyle,
        trailingIconStyle,
        supportingTextStyle,
        activeIndicatorStyle,
        inputRef,
        inputStyle,
        trailingIconShow,
        label,
        error,
        supportingText,
        onPress,
        onHoverIn,
        onHoverOut,
        onTailingIconPress,
        onMainLayout,
        hoveredProps,
        ...textInputProps
    }: RenderProps) => (
        <Container
            testID={`textfield__container--${id}`}
            onPress={onPress}
            onHoverIn={onHoverIn}
            onHoverOut={onHoverOut}>
            <Main
                testID={`textField__main--${id}`}
                shape="extraSmallTop"
                type={type}
                trailingIconShow={trailingIconShow}
                onLayout={onMainLayout}>
                <Content testID={`textField__content--${id}`}>
                    <AnimatedLabel testID={`textfield__label--${id}`} style={labelStyle}>
                        {label}
                    </AnimatedLabel>

                    <AnimatedTextInput
                        testID={`textfield__textInput--${id}`}
                        {...textInputProps}
                        ref={inputRef}
                        style={inputStyle}
                    />
                </Content>

                {trailingIconShow && (
                    <Pressable onPress={onTailingIconPress}>
                        <AnimatedTrailingIcon
                            testID={`textfield__trailingIcon--${id}`}
                            style={trailingIconStyle}>
                            {trailingIcon}
                        </AnimatedTrailingIcon>
                    </Pressable>
                )}

                {type === 'filled' && (
                    <AnimatedActiveIndicator
                        testID={`textfield__activeIndicator--${id}`}
                        style={activeIndicatorStyle}
                    />
                )}

                {hoveredProps && <Hovered {...hoveredProps} />}

                {/* {disabled && (
                    <Disabled
                        testID={`textField__disabled--${id}`}
                        style={{width: mainLayout.width, height: mainLayout.height}}
                        shape="extraSmallTop"
                    />
                )} */}
            </Main>

            <AnimatedSupportingText
                testID={`textfield__supportingText--${id}`}
                style={supportingTextStyle}
                error={error}>
                {supportingText}
            </AnimatedSupportingText>
        </Container>
    );

    return <BaseTextField {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
