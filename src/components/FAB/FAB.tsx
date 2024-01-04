import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Size} from '../Common/interface';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './FAB.styles';
import {FABBase, RenderProps} from './FABBase';

export type FABType = 'surface' | 'primary' | 'secondary' | 'tertiary';

export interface FABProps extends TouchableRippleProps {
    elevation?: boolean;
    icon?: React.JSX.Element;
    labelText?: string;
    size?: Size;
    type?: FABType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefFAB = forwardRef<View, FABProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            elevationLevel,
            eventName,
            icon,
            id,
            labelText,
            onEvent,
            renderStyle,
            type,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {backgroundColor, color, height, width} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const shape = 'medium';

        return (
            <Container
                {...containerProps}
                accessibilityLabel={labelText}
                accessibilityRole="button"
                testID={`fba--${id}`}>
                <Elevation level={elevationLevel} shape={shape}>
                    <TouchableRipple
                        {...onTouchableRippleEvent}
                        shape={shape}
                        underlayColor={underlayColor}>
                        <AnimatedContent
                            labelTextShow={!!labelText}
                            onLayout={onLayout}
                            shape={shape}
                            style={{backgroundColor}}
                            testID={`fba__content--${id}`}
                            type={type}>
                            {icon && (
                                <Icon testID={`fba__icon--${id}`}>{icon}</Icon>
                            )}

                            {labelText && (
                                <AnimatedLabelText
                                    size="large"
                                    style={{color}}
                                    type="label">
                                    {labelText}
                                </AnimatedLabelText>
                            )}

                            <Hovered
                                eventName={eventName}
                                height={height}
                                shape={shape}
                                underlayColor={underlayColor}
                                width={width}
                            />
                        </AnimatedContent>
                    </TouchableRipple>
                </Elevation>
            </Container>
        );
    };

    return <FABBase {...props} render={render} ref={ref} />;
});

export const FAB: FC<FABProps> = memo(ForwardRefFAB);
