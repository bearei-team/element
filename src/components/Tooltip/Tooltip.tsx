import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, SupportingText} from './Tooltip.styles';
import {RenderProps, TooltipBase} from './TooltipBase';

export type TooltipType = 'plain' | 'rich';
export interface TooltipProps extends TouchableRippleProps {
    supportingText?: string;
    type?: TooltipType;
    visible?: boolean;
}

/**
 * TODO: "rich"
 */
const AnimatedContent = Animated.createAnimatedComponent(Content);
const render = ({
    children,
    id,
    onEvent,
    renderStyle,
    style,
    supportingText,
    type,
    ...contentProps
}: RenderProps) => {
    const {opacity, width, height} = renderStyle;

    return (
        <Container testID={`tooltip--${id}`}>
            {children}

            <AnimatedContent
                {...contentProps}
                {...onEvent}
                testID={`tooltip__content--${id}`}
                type={type}
                style={{
                    ...(typeof style === 'object' && style),
                    opacity,
                    transform: [{translateX: -(width / 2)}],
                }}
                height={height}
                shape="extraSmall"
                width={width}>
                {type === 'plain' && supportingText && (
                    <SupportingText
                        testID={`tooltip__supportingText--${id}`}
                        numberOfLines={1}
                        ellipsizeMode="tail">
                        {supportingText}
                    </SupportingText>
                )}
            </AnimatedContent>
        </Container>
    );
};

const ForwardRefTooltip = forwardRef<View, TooltipProps>((props, ref) => (
    <TooltipBase {...props} ref={ref} render={render} />
));

export const Tooltip: FC<TooltipProps> = memo(ForwardRefTooltip);
