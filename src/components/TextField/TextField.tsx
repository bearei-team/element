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
}

const ForwardRefTextField = forwardRef<TextInput, TextFieldProps>((props, ref) => {
    const AnimatedLabel = Animated.createAnimatedComponent(Label);
    const AnimatedTextInput = Animated.createAnimatedComponent(Input);
    const AnimatedActiveIndicator = Animated.createAnimatedComponent(ActiveIndicator);
    const AnimatedTrailingIcon = Animated.createAnimatedComponent(TrailingIcon);
    const render = ({
        id,
        trailingIcon,
        type,
        labelStyle,
        activeIndicatorStyle,
        trailingIconStyle,
        inputRef,
        inputStyle,
        trailingIconShow,
        label,
        supportingText,
        onPress,
        onTailingIconPress,
        onMainLayout,
        hoveredProps,
        ...textInputProps
    }: RenderProps) => (
        <Container testID={`textfield__container--${id}`} onPress={onPress}>
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
            </Main>

            <SupportingText testID={`textfield__supportingText--${id}`}>
                {supportingText}
            </SupportingText>
        </Container>
    );

    return <BaseTextField {...props} ref={ref} render={render} />;
});

export const TextField: FC<TextFieldProps> = memo(ForwardRefTextField);
