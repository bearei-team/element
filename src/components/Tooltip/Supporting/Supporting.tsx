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
            shape="extraSmall"
            containerHeight={containerLayout.height}
            containerPageX={containerLayout.pageX}
            containerPageY={containerLayout.pageY}
            containerWidth={containerLayout.width}
            layoutHeight={height}
            layoutWidth={width}
            renderStyle={{width, height}}
            supportingPosition={supportingPosition}
            testID={`tooltip__supporting--${id}`}
            type={type}
            visible={visible}
            style={{
                opacity: renderOpacity,

                /** ts
                 * The transform property in react-native-macos 0.72.* has various bugs that cause
                 * problems when using transform to implement offsets. Here is a temporary implementation
                 * using margin.
                 *
                 * Original realization:
                 * @example
                 * ```ts
                 *  transform: supportingPosition?.startsWith('vertical')
                 *      ? [{translateX: -(width / 2)}]
                 *      : [{translateY: -(height / 2)}]
                 * ```
                 */
                ...(supportingPosition?.startsWith('vertical')
                    ? {marginLeft: -(width / 2)}
                    : {marginTop: -(height / 2)}),
            }}>
            <Inner {...onEvent} testID={`tooltip__supportingInner--${id}`}>
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
