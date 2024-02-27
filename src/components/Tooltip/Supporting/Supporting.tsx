import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Container, Inner, SupportingText} from './Supporting.styles';
import {RenderProps, SupportingBase, SupportingProps} from './SupportingBase';

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
    const renderOpacity = width === 0 ? 0 : opacity;

    return (
        <AnimatedContainer
            {...containerProps}
            {...onEvent}
            containerHeight={containerLayout.height}
            containerPageX={containerLayout.pageX}
            containerPageY={containerLayout.pageY}
            containerWidth={containerLayout.width}
            layoutHeight={height}
            layoutWidth={width}
            supportingPosition={supportingPosition}
            testID={`tooltip__supporting--${id}`}
            type={type}
            visible={visible}
            style={{
                opacity: renderOpacity,
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
export type {SupportingProps};
