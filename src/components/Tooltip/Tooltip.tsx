import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Supporting, SupportingText} from './Tooltip.styles';
import {RenderProps, TooltipBase} from './TooltipBase';

export type TooltipType = 'plain' | 'rich';
export interface TooltipProps extends TouchableRippleProps {
    position?: 'horizontalStart' | 'horizontalEnd' | 'verticalStart' | 'verticalEnd';
    supportingText?: string;
    type?: TooltipType;
    visible?: boolean;
}

/**
 * TODO: "rich"
 */
const AnimatedSupporting = Animated.createAnimatedComponent(Supporting);
const render = ({
    children,
    id,
    onEvent,
    renderStyle,
    style,
    supportingText,
    type,
    position,
    ...contentProps
}: RenderProps) => {
    const {opacity, supportingWidth, supportingHeight, width, height} = renderStyle;

    return (
        <Container testID={`tooltip--${id}`} width={width} height={height}>
            {children}

            <AnimatedSupporting
                {...contentProps}
                {...onEvent}
                testID={`tooltip__supporting--${id}`}
                type={type}
                style={{
                    ...(typeof style === 'object' && style),
                    opacity,
                    transform: position?.startsWith('vertical')
                        ? [{translateX: -((supportingWidth ?? 0) / 2)}]
                        : [{translateY: -((supportingHeight ?? 0) / 2)}],
                }}
                height={supportingHeight}
                position={position}
                shape="extraSmall"
                width={supportingWidth}>
                {type === 'plain' && supportingText && (
                    <SupportingText
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        size="small"
                        testID={`tooltip__supportingText--${id}`}
                        type="body">
                        {supportingText}
                    </SupportingText>
                )}
            </AnimatedSupporting>
        </Container>
    );
};

const ForwardRefTooltip = forwardRef<View, TooltipProps>((props, ref) => (
    <TooltipBase {...props} ref={ref} render={render} />
));

export const Tooltip: FC<TooltipProps> = memo(ForwardRefTooltip);
