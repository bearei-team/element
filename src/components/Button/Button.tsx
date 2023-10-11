import React, {FC, useRef} from 'react';
import {
    BasicButtonProps,
    Basic,
    ButtonContainerProps,
    ButtonIconProps,
    ButtonMainProps,
    State,
} from './Basic';
import {Container, Main, Layer0, Layer1, Icon, Shadow0, Shadow1, Layer2} from './Button.styles';
import {Animated, Easing} from 'react-native';
import {useTheme} from 'styled-components/native';

export interface ButtonProps extends BasicButtonProps {}

export const Button: FC<ButtonProps> = props => {
    const shadowAnim = useRef(new Animated.Value(0)).current;
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;
    const theme = useTheme();
    const {bezier, duration} = theme.transition({duration: 'short3', easing: 'emphasized'});
    const customEasing = Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1);
    const animIn = (animatedValue: Animated.Value) => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration,
            easing: customEasing,
            useNativeDriver: true,
        }).start();
    };

    const animOut = (animatedValue: Animated.Value) => {
        Animated.timing(animatedValue, {
            toValue: 0,
            duration,
            easing: customEasing,
            useNativeDriver: true,
        }).start();
    };

    const shadowOpacity = () =>
        shadowAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        });

    const backgroundColor = (state: State) => {
        const stateOpacity = {
            enabled: 0,
            hovered: 0.08,
            focused: 0.12,
            pressed: 0.12,
            disabled: 0,
        };

        return backgroundColorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
                theme.color.rgba({
                    color: theme.palette.primary.onPrimary,
                    opacity: 0,
                }),
                theme.color.rgba({
                    color: theme.palette.primary.onPrimary,
                    opacity: stateOpacity[state],
                }),
            ],
        });
    };

    const createHandleIn = (setState: (state: State) => void) => (state: State) => {
        setState(state);

        if (state === 'hovered') {
            animIn(backgroundColorAnim);
            animIn(shadowAnim);
        } else {
            animIn(backgroundColorAnim);
            animOut(shadowAnim);
        }
    };

    const createHandleOut = (setState: (state: State) => void) => (state: State) => {
        setState(state);
        animOut(shadowAnim);
        animOut(backgroundColorAnim);
    };

    const renderContainer = ({id, type, children, handleState, state}: ButtonContainerProps) => {
        const handleIn = createHandleIn(handleState);
        const handleOut = createHandleOut(handleState);

        return (
            <Container
                testID={`button__container--${id}`}
                role="button"
                onHoverIn={() => handleIn('hovered')}
                onHoverOut={() => handleOut('enabled')}
                onPressIn={() => handleIn('pressed')}
                onPressOut={() => handleIn('hovered')}
                onFocus={() => handleIn('focused')}
                onBlur={() => handleOut('enabled')}>
                <Layer0 testID={`button__layer0--${id}`}>
                    <Layer1
                        testID={`button__layer1--${id}`}
                        type={type}
                        style={{backgroundColor: backgroundColor(state)}}>
                        {children}
                    </Layer1>
                </Layer0>

                <Layer2 testID={`button__layer2--${id}`} style={{opacity: shadowOpacity()}}>
                    <Shadow0 testID={`button__shadow0--${id}`} />
                    <Shadow1 testID={`button__shadow1--${id}`} />
                </Layer2>
            </Container>
        );
    };

    const renderMain = ({id, label, state}: ButtonIconProps) => (
        <Main testID={`button__main--${id}`} state={state}>
            {label}
        </Main>
    );

    const renderIcon = ({id, children}: ButtonMainProps) => (
        <Icon testID={`button__icon--${id}`}>{children}</Icon>
    );

    return (
        <Basic
            {...props}
            renderIcon={renderIcon}
            renderMain={renderMain}
            renderContainer={renderContainer}
        />
    );
};
