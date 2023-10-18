import React, {FC, useRef} from 'react';
import {
    BasicButtonProps,
    Basic,
    ButtonContainerProps,
    ButtonIconProps,
    ButtonMainProps,
    State,
    Type,
} from './Basic';
import {Container, Main, Layer0, Layer1, Icon, Shadow0, Shadow1, Layer2} from './Button.styles';
import {Animated, Easing} from 'react-native';
import {useTheme} from 'styled-components/native';

export interface ButtonProps extends BasicButtonProps {}

export interface RunAnimOptions {
    toValue: number;
    finished?: () => void;
}

export const Button: FC<ButtonProps> = ({type = 'filled', ...props}): React.JSX.Element => {
    const shadowAnim = useRef(new Animated.Value(0)).current;
    const backgroundColorAnim = useRef(new Animated.Value(0)).current;
    const borderColorAnim = useRef(new Animated.Value(0)).current;
    const theme = useTheme();

    const runAnim = (animatedValue: Animated.Value, {toValue, finished}: RunAnimOptions): void => {
        const {bezier, duration} = theme.transition({duration: 'short3', easing: 'standard'});
        const easing = Easing.bezier(bezier.x0, bezier.y0, bezier.x1, bezier.y1);

        Animated.timing(animatedValue, {
            toValue,
            duration,
            easing,
            useNativeDriver: true,
        }).start(({finished: animFinished}) => animFinished && finished?.());
    };

    const shadowOpacity = (): Animated.AnimatedInterpolation<string | number> =>
        shadowAnim.interpolate({inputRange: [0, 1], outputRange: [0, 1]});

    const backgroundColor = (
        backgroundType: Type,
    ): Animated.AnimatedInterpolation<string | number> => {
        const typeColor = {
            filled: theme.palette.primary.onPrimary,
            outlined: theme.palette.primary.primary,
            text: theme.palette.primary.primary,
            elevated: theme.palette.primary.primary,
        };

        const color = typeColor[backgroundType];

        return backgroundColorAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [
                theme.color.rgba({color, opacity: 0}),
                theme.color.rgba({color, opacity: 0.08}),
                theme.color.rgba({color, opacity: 0.12}),
            ],
        });
    };

    const borderColor = (): Animated.AnimatedInterpolation<string | number> =>
        borderColorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [theme.palette.outline.outline, theme.palette.primary.primary],
        });

    const createHandleIn =
        (curState: State, setState: (state: State) => void) =>
        (state: State): void => {
            if (curState === 'disabled') {
                return;
            }

            const finished = () => setState(state);

            if (type === 'outlined') {
                runAnim(borderColorAnim, {toValue: state === 'focused' ? 1 : 0});
            }

            if (state === 'hovered') {
                runAnim(backgroundColorAnim, {toValue: 0.5});
                runAnim(shadowAnim, {toValue: 1, finished});
            } else {
                runAnim(shadowAnim, {toValue: 0});
                runAnim(backgroundColorAnim, {toValue: 1, finished});
            }
        };

    const createHandleOut =
        (curState: State, setState: (state: State) => void) =>
        (state: State): void => {
            if (curState === 'disabled') {
                return;
            }

            const finished = () => setState(state);

            runAnim(shadowAnim, {toValue: 0});
            runAnim(backgroundColorAnim, {toValue: 0});
            runAnim(borderColorAnim, {toValue: 0, finished});
        };

    const renderContainer = ({
        id,
        type: containerType,
        children,
        state,
        showIcon,
        handleState,
    }: ButtonContainerProps): React.JSX.Element => {
        const handleIn = createHandleIn(state, handleState);
        const handleOut = createHandleOut(state, handleState);
        const isDisabled = state === 'disabled';
        const noneBackground =
            (containerType === 'outlined' || containerType === 'text') && isDisabled;

        const disableColor = theme.color.rgba({
            color: theme.palette.surface.onSurface,
            opacity: 0.12,
        });

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
                <Layer0
                    testID={`button__layer0--${id}`}
                    type={containerType}
                    state={state}
                    style={{
                        borderColor: !isDisabled ? borderColor() : disableColor,
                    }}>
                    <Layer1
                        {...(!noneBackground && {
                            style: {
                                backgroundColor: !isDisabled
                                    ? backgroundColor(containerType!)
                                    : disableColor,
                            },
                        })}
                        testID={`button__layer1--${id}`}
                        type={containerType}
                        showIcon={showIcon}>
                        {children}
                    </Layer1>
                </Layer0>

                <Layer2 testID={`button__layer2--${id}`} style={{opacity: shadowOpacity()}}>
                    <Shadow0 testID={`button__shadow0--${id}`} type={containerType} />
                    <Shadow1 testID={`button__shadow1--${id}`} type={containerType} />
                </Layer2>
            </Container>
        );
    };

    const renderMain = ({id, label, state, type: mainType}: ButtonIconProps): React.JSX.Element => (
        <Main testID={`button__main--${id}`} state={state} type={mainType}>
            {label}
        </Main>
    );

    const renderIcon = ({id, children, state}: ButtonMainProps): React.JSX.Element => (
        <Icon testID={`button__icon--${id}`} state={state}>
            {children}
        </Icon>
    );

    return (
        <Basic
            {...props}
            type={type}
            renderIcon={renderIcon}
            renderMain={renderMain}
            renderContainer={renderContainer}
        />
    );
};
