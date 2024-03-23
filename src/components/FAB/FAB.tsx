import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Hovered} from '../Underlay/Hovered';
import {Container, Content, Icon, LabelText} from './FAB.styles';
import {FABBase, FABProps, RenderProps} from './FABBase';

const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    accessibilityLabel,
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
    const {backgroundColor, color} = renderStyle;
    const shape = 'medium';

    return (
        <Container
            accessibilityLabel={labelText ?? accessibilityLabel}
            accessibilityRole="button"
            testID={`fab--${id}`}>
            <TouchableRipple
                {...onEvent}
                shape={shape}
                underlayColor={underlayColor}
                style={{
                    ...(typeof style === 'object' && style),
                    backgroundColor,
                }}>
                <Content
                    {...contentProps}
                    labelTextShow={!!labelText}
                    testID={`fab__content--${id}`}
                    type={type}>
                    {icon && <Icon testID={`fab__icon--${id}`}>{icon}</Icon>}

                    {labelText && (
                        <AnimatedLabelText
                            size="large"
                            style={{color}}
                            testID={`fab__labelText--${id}`}
                            type="label">
                            {labelText}
                        </AnimatedLabelText>
                    )}

                    <Hovered eventName={eventName} underlayColor={underlayColor} />
                </Content>
            </TouchableRipple>

            <Elevation level={elevation} shape={shape} />
        </Container>
    );
};

const ForwardRefFAB = forwardRef<View, FABProps>((props, ref) => (
    <FABBase {...props} ref={ref} render={render} />
));

export const FAB: FC<FABProps> = memo(ForwardRefFAB);
export type {FABProps};
