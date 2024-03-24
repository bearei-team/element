import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Container, Inner, SupportingText} from './Supporting.styles'
import {RenderProps, SupportingBase, SupportingProps} from './SupportingBase'

const AnimatedContainer = Animated.createAnimatedComponent(Container)
const render = ({
    closed,
    containerLayout,
    id,
    onEvent,
    renderStyle,
    supportingPosition = 'verticalStart',
    supportingText,
    type,
    ...containerProps
}: RenderProps) => {
    const {width = 0, height = 0, animatedStyle} = renderStyle

    return (
        <AnimatedContainer
            {...containerProps}
            containerHeight={containerLayout.height}
            containerPageX={containerLayout.pageX}
            containerPageY={containerLayout.pageY}
            containerWidth={containerLayout.width}
            layoutHeight={height}
            layoutWidth={width}
            renderStyle={{width, height}}
            shape='extraSmall'
            supportingPosition={supportingPosition}
            testID={`tooltip__supporting--${id}`}
            type={type}
            visible={!closed}
            style={[
                width === 0 ? {opacity: width} : animatedStyle,

                /**
                 * The transform property in react-native-macos 0.72.* has
                 * various bugs that cause problems when using transform to
                 * implement offsets. Here is a temporary implementation using
                 * margin.
                 *
                 * Original realization:
                 * @example
                 * ```ts
                 *  transform: supportingPosition?.startsWith('vertical')
                 *      ? [{translateX: -(width / 2)}]
                 *      : [{translateY: -(height / 2)}]
                 * ```
                 */
                supportingPosition?.startsWith('vertical') ?
                    {marginLeft: -(width / 2)}
                :   {marginTop: -(height / 2)}
            ]}
        >
            <Inner
                {...onEvent}
                testID={`tooltip__supportingInner--${id}`}
            >
                <SupportingText
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    size='small'
                    testID={`tooltip__supportingText--${id}`}
                    type='body'
                >
                    {supportingText}
                </SupportingText>
            </Inner>
        </AnimatedContainer>
    )
}

const ForwardRefSupporting = forwardRef<View, SupportingProps>((props, ref) => (
    <SupportingBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Supporting: FC<SupportingProps> = memo(ForwardRefSupporting)
export type {SupportingProps}
