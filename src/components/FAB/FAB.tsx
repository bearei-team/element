import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './FAB.styles';
import {FABBase, FABProps, RenderProps} from './FABBase';

const AnimatedContent = Animated.createAnimatedComponent(Content);
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
    const {backgroundColor, color, height, width} = renderStyle;
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const shape = 'medium';

    return (
        <Container
            accessibilityLabel={labelText ?? accessibilityLabel}
            accessibilityRole="button"
            testID={`fab--${id}`}>
            <Elevation level={elevation} shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <AnimatedContent
                        {...contentProps}
                        labelTextShow={!!labelText}
                        onLayout={onLayout}
                        shape={shape}
                        style={{
                            ...(typeof style === 'object' && style),
                            backgroundColor,
                        }}
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

                        <Hovered
                            eventName={eventName}
                            renderStyle={{width, height}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </AnimatedContent>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefFAB = forwardRef<View, FABProps>((props, ref) => (
    <FABBase {...props} ref={ref} render={render} />
));

export const FAB: FC<FABProps> = memo(ForwardRefFAB);
export type {FABProps};
