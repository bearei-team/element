import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Button.styles';
import {ButtonBase, ButtonProps, RenderProps} from './ButtonBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    block,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    style,
    type,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, color, ...border} = renderStyle;
    const link = type === 'link';
    const shape = link ? 'none' : 'full';

    return (
        <Container
            accessibilityLabel={labelText}
            accessibilityRole="button"
            block={block}
            testID={`button--${id}`}>
            <TouchableRipple
                {...onEvent}
                block={block}
                style={{
                    ...(typeof style === 'object' && style),
                    ...border,
                    backgroundColor,
                }}
                disabled={disabled}
                shape={shape}
                underlayColor={underlayColor}>
                <Content
                    {...contentProps}
                    block={block}
                    iconShow={!!icon}
                    testID={`button__content--${id}`}
                    type={type}>
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

                    <Hovered eventName={eventName} underlayColor={underlayColor} />
                </Content>
            </TouchableRipple>

            <Elevation level={elevation} shape={shape} />
        </Container>
    );
};

const ForwardRefButton = forwardRef<View, ButtonProps>((props, ref) => (
    <ButtonBase {...props} ref={ref} render={render} />
));

export const Button: FC<ButtonProps> = memo(ForwardRefButton);
export type {ButtonProps};
