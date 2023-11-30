import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Disabled} from '../Common/Common.styles';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Icon, LabelText, Main} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export interface ButtonProps extends TouchableRippleProps {
    disabled?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    loading?: boolean;
    type?: ButtonType;
}

const AnimatedMain = Animated.createAnimatedComponent(Main);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            disabled,
            elevation,
            icon,
            id,
            labelText,
            renderStyle,
            shape,
            showIcon,
            state,
            style,
            type,
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {color, touchableRippleHeight, touchableRippleWidth, ...mainStyle} = renderStyle;

        return (
            <Container
                accessibilityLabel={labelText}
                accessibilityRole="button"
                testID={`button--${id}`}>
                <Elevation level={elevation} shape={shape}>
                    <TouchableRipple
                        {...touchableRippleProps}
                        ref={ref}
                        shape={shape}
                        underlayColor={underlayColor}>
                        <AnimatedMain
                            shape={shape}
                            showIcon={showIcon}
                            style={{...(typeof style === 'object' && style), ...mainStyle}}
                            testID={`button__main--${id}`}
                            type={type}>
                            {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}

                            <AnimatedLabelText
                                style={{color}}
                                testID={`button__labelText--${id}`}
                                type={type}>
                                {labelText}
                            </AnimatedLabelText>
                        </AnimatedMain>

                        <Hovered
                            height={touchableRippleHeight}
                            shape={shape}
                            state={state}
                            underlayColor={underlayColor}
                            width={touchableRippleWidth}
                        />
                    </TouchableRipple>
                </Elevation>

                {disabled && (
                    <Disabled
                        height={touchableRippleHeight}
                        testID={`button__disabled--${id}`}
                        width={touchableRippleWidth}
                    />
                )}
            </Container>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
