import {FC, memo} from 'react';
import {Animated, TextInputProps} from 'react-native';
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

export type Type = 'filled' | 'outlined';
export interface TextFieldProps extends TextInputProps {
    label?: string;
    type?: Type;
    trailingIcon?: React.JSX.Element;
    supportingText?: string;
}

export const TextField: FC<TextFieldProps> = memo(props => {
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
        onPress,
        ...textInputProps
    }: RenderProps) => (
        <Container testID={`textfield__container--${id}`} onPress={onPress}>
            <Main testID={`textField__main--${id}`} shape="extraSmallTop" type={type}>
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
                    <AnimatedTrailingIcon
                        testID={`textfield__trailingIcon--${id}`}
                        style={trailingIconStyle}>
                        {trailingIcon}
                    </AnimatedTrailingIcon>
                )}

                {type === 'filled' && (
                    <AnimatedActiveIndicator
                        testID={`textfield__activeIndicator--${id}`}
                        style={activeIndicatorStyle}
                    />
                )}
            </Main>

            <SupportingText testID={`textfield__supportingText--${id}`}>
                {'SupportingText'}
            </SupportingText>
        </Container>
    );

    return <BaseTextField {...props} render={render} />;
});
