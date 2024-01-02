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

export type ButtonType =
    | 'elevated'
    | 'filled'
    | 'link'
    | 'outlined'
    | 'text'
    | 'tonal';

export type Category = 'common' | 'icon' | 'fab' | 'radio' | 'checkbox';
export type FabType = 'surface' | 'primary' | 'secondary' | 'tertiary';

export interface ButtonProps extends TouchableProps {
    block?: boolean;
    category?: Category;
    checked?: boolean;
    disabled?: boolean;
    elevation?: boolean;
    fabType?: FabType;
    icon?: React.JSX.Element;
    indeterminate?: boolean;

    /**
     * Sets the button text, this parameter is only valid for buttons with categories common and fab
     */
    labelText?: string;

    /**
     *  Listen to the button checked state, this option is only available when the button category is radio or checkbox
     */
    onCheckedChange?: (checked: boolean) => void;

    /**
     * The size option is only available for buttons in the Fab category
     */
    size?: Size;
    type?: ButtonType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            block,
            category,
            elevation,
            icon,
            iconShow,
            id,
            labelText,
            labelTextShow,
            onContentLayout,
            onLayout,
            renderStyle,
            shape,
            size,
            state,
            style,
            type,
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {
            color,
            contentHeight,
            contentWidth,
            height,
            width,
            ...contentStyle
        } = renderStyle;

        return (
            <Container
                accessibilityLabel={labelText}
                accessibilityRole="button"
                block={block}
                category={category}
                height={contentHeight}
                onLayout={onLayout}
                size={size}
                testID={`button--${id}`}
                type={type}
                width={contentWidth}>
                <Elevation level={elevation} shape={shape}>
                    <TouchableRipple
                        {...touchableRippleProps}
                        ref={ref}
                        shape={shape}
                        underlayColor={underlayColor}>
                        <AnimatedContent
                            block={block}
                            category={category}
                            iconShow={iconShow}
                            labelTextShow={labelTextShow}
                            onLayout={onContentLayout}
                            shape={shape}
                            size={size}
                            style={{
                                ...(typeof style === 'object' && style),
                                ...contentStyle,
                            }}
                            testID={`button__content--${id}`}
                            type={type}
                            width={width}>
                            {iconShow && type !== 'link' && (
                                <Icon
                                    category={category}
                                    testID={`button__icon--${id}`}>
                                    {icon}
                                </Icon>
                            )}

                            {category !== 'icon' && labelText && (
                                <AnimatedLabelText
                                    ellipsizeMode="tail"
                                    numberOfLines={1}
                                    style={{color}}
                                    testID={`button__labelText--${id}`}
                                    type={type}>
                                    {labelText}
                                </AnimatedLabelText>
                            )}
                        </AnimatedContent>

                        {[typeof contentWidth, typeof width].includes(
                            'number',
                        ) && (
                            <Hovered
                                height={block ? height : contentHeight}
                                shape={shape}
                                state={state}
                                underlayColor={underlayColor}
                                width={block ? width : contentWidth}
                            />
                        )}
                    </TouchableRipple>
                </Elevation>
            </Container>
        );
    };

    return <ButtonBase {...props} render={render} />;
});

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
