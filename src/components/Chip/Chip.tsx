import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Hovered} from '../Underlay/Hovered';
import {Container, Content, Icon, LabelText} from './Chip.styles';
import {ChipBase, ChipProps, RenderProps} from './ChipBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    active,
    activeColor,
    touchableLocation,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    style,
    trailingIcon,
    type,
    underlayColor,
    block,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, color, ...border} = renderStyle;
    const shape = 'extraSmall';

    return (
        <Container accessibilityLabel={labelText} testID={`chip--${id}`} block={block}>
            <TouchableRipple
                {...onEvent}
                active={active}
                disabled={disabled}
                shape={shape}
                underlayColor={activeColor}
                touchableLocation={touchableLocation}
                block={block}
                style={{
                    ...(typeof style === 'object' && style),
                    ...border,
                    backgroundColor,
                }}>
                <Content
                    {...contentProps}
                    iconShow={!!icon}
                    trailingIconShow={!!trailingIcon}
                    testID={`chip__content--${id}`}
                    type={type}>
                    {icon && <Icon testID={`chip__icon--${id}`}>{icon}</Icon>}

                    <AnimatedLabelText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        size="large"
                        style={{color}}
                        testID={`chip__labelText--${id}`}
                        type="label">
                        {labelText}
                    </AnimatedLabelText>

                    {trailingIcon && (
                        <Icon testID={`chip__trailingIcon--${id}`}>{trailingIcon}</Icon>
                    )}

                    <Hovered eventName={eventName} underlayColor={underlayColor} />
                </Content>
            </TouchableRipple>

            <Elevation level={elevation} shape={shape} />
        </Container>
    );
};

const ForwardRefChip = forwardRef<View, ChipProps>((props, ref) => (
    <ChipBase {...props} ref={ref} render={render} />
));

export const Chip: FC<ChipProps> = memo(ForwardRefChip);
export type {ChipProps};
