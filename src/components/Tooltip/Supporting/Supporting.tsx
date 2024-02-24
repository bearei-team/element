import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, ScaledSize, View, ViewProps} from 'react-native';
import {TooltipProps} from '../Tooltip';
import {Container, Inner, SupportingText} from './Supporting.styles';
import {RenderProps, SupportingBase} from './SupportingBase';

export interface SupportingProps
    extends Partial<
        Pick<
            TooltipProps,
            'supportingPosition' | 'supportingText' | 'visible' | 'type' | 'defaultVisible'
        > &
            ViewProps &
            RefAttributes<View>
    > {
    containerCurrent: View | null;
    onVisible: (visible: boolean) => void;
    windowDimensions: ScaledSize;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const render = ({
    containerLayout,
    id,
    onEvent,
    renderStyle,
    supportingPosition = 'verticalStart',
    supportingText,
    type,
    visible,
    ...containerProps
}: RenderProps) => {
    const {width = 0, height = 0, opacity} = renderStyle;

    return (
        <AnimatedContainer
            {...containerProps}
            {...onEvent}
            containerHeight={containerLayout.height}
            containerPageX={containerLayout.pageX}
            containerPageY={containerLayout.pageY}
            containerWidth={containerLayout.width}
            renderedHeight={height}
            renderedWidth={width}
            supportingPosition={supportingPosition}
            testID={`tooltip__supporting--${id}`}
            type={type}
            visible={visible}
            style={{
                opacity,
                transform: supportingPosition?.startsWith('vertical')
                    ? [{translateX: -(width / 2)}]
                    : [{translateY: -(height / 2)}],
            }}>
            <Inner testID={`tooltip__supportingInner--${id}`} shape="extraSmall">
                <SupportingText
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    size="small"
                    testID={`tooltip__supportingText--${id}`}
                    type="body">
                    {supportingText}
                </SupportingText>
            </Inner>
        </AnimatedContainer>
    );
};

const ForwardRefSupporting = forwardRef<View, SupportingProps>((props, ref) => (
    <SupportingBase {...props} ref={ref} render={render} />
));

export const Supporting: FC<SupportingProps> = memo(ForwardRefSupporting);
