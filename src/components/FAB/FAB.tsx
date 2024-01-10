import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Size} from '../Common/interface';
import {Elevation, ElevationLevel} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {
    TouchableRipple,
    TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './FAB.styles';
import {FABBase, RenderProps} from './FABBase';

export type FABType = 'surface' | 'primary' | 'secondary' | 'tertiary';

export interface FABProps extends TouchableRippleProps {
    defaultElevation?: ElevationLevel;
    disabled?: boolean;
    disabledElevation?: boolean;
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
            accessibilityLabel,
            defaultElevation,
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
        } = renderProps;

        const {backgroundColor, color, height, width} = renderStyle;
        const {onLayout, ...onTouchableRippleEvent} = onEvent;
        const shape = 'medium';

        return (
            <Container
                accessibilityLabel={labelText ?? accessibilityLabel}
                accessibilityRole="button"
                testID={`fab--${id}`}>
                <Elevation
                    level={elevation}
                    shape={shape}
                    defaultLevel={defaultElevation}>
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
                            {icon && (
                                <Icon testID={`fab__icon--${id}`}>{icon}</Icon>
                            )}

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

    return <FABBase {...props} ref={ref} render={render} />;
});

export const FAB: FC<FABProps> = memo(ForwardRefFAB);
