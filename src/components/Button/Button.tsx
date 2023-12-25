import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Size} from '../Common/interface';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {
    TouchableProps,
    TouchableRipple,
} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, RenderProps} from './ButtonBase';

export type ButtonType = 'elevated' | 'filled' | 'outlined' | 'text' | 'tonal';
export type Category = 'common' | 'icon' | 'fab';
export type FabType = 'surface' | 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends TouchableProps {
    category?: Category;
    disabled?: boolean;
    elevation?: boolean;
    fabType?: FabType;
    icon?: React.JSX.Element;
    labelText?: string;
    size?: Size;
    type?: ButtonType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            category,
            elevation,
            icon,
            iconShow,
            id,
            labelText,
            labelTextShow,
            renderStyle,
            shape,
            size,
            state,
            style,
            type,
            onLayout,
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {color, height, width, ...contentStyle} = renderStyle;

        return (
            <Container
                accessibilityLabel={labelText}
                accessibilityRole="button"
                testID={`button--${id}`}
                onLayout={onLayout}>
                {typeof width === 'number' && (
                    <Elevation level={elevation} shape={shape}>
                        <TouchableRipple
                            {...touchableRippleProps}
                            ref={ref}
                            shape={shape}
                            underlayColor={underlayColor}>
                            <AnimatedContent
                                category={category}
                                iconShow={iconShow}
                                labelTextShow={labelTextShow}
                                shape={shape}
                                size={size}
                                style={{
                                    ...(typeof style === 'object' && style),
                                    ...contentStyle,
                                }}
                                testID={`button__content--${id}`}
                                type={type}
                                width={width}>
                                {iconShow && (
                                    <Icon
                                        category={category}
                                        testID={`button__icon--${id}`}>
                                        {icon}
                                    </Icon>
                                )}

                                {category !== 'icon' && labelText && (
                                    <AnimatedLabelText
                                        style={{color}}
                                        testID={`button__labelText--${id}`}
                                        type={type}>
                                        {labelText}
                                    </AnimatedLabelText>
                                )}
                            </AnimatedContent>

                            <Hovered
                                height={height}
                                shape={shape}
                                state={state}
                                underlayColor={underlayColor}
                                width={width}
                            />
                        </TouchableRipple>
                    </Elevation>
                )}
            </Container>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
