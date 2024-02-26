import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {TooltipProps} from '../Tooltip/Tooltip';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon} from './IconButton.styles';
import {IconButtonBase, RenderProps} from './IconButtonBase';

export type IconButtonType = 'filled' | 'outlined' | 'standard' | 'tonal';
export interface IconButtonProps extends Partial<TouchableRippleProps> {
    fill?: string;
    icon?: React.JSX.Element;
    renderStyle?: {width?: number; height?: number};
    tooltip?: TooltipProps;
    type?: IconButtonType;
}

/**
 * TODO: Selected
 */

const AnimatedContent = Animated.createAnimatedComponent(Content);
const render = ({
    disabled,
    eventName,
    icon,
    id,
    onEvent,
    renderStyle,
    style,
    tooltip = {},
    tooltipVisible,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, height, width, layoutHeight, layoutWidth, ...border} = renderStyle;
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const {supportingText, supportingPosition} = tooltip;
    const shape = 'full';

    return (
        <Container
            accessibilityRole="button"
            testID={`iconButton--${id}`}
            renderStyle={{width: layoutWidth, height: layoutHeight}}>
            {/* <Tooltip
                type="plain"
                visible={tooltipVisible}
                supportingText={supportingText}
                supportingPosition={supportingPosition}>
               
            </Tooltip> */}

            <TouchableRipple
                {...onTouchableRippleEvent}
                disabled={disabled}
                shape={shape}
                underlayColor={underlayColor}>
                <AnimatedContent
                    {...contentProps}
                    onLayout={onLayout}
                    shape={shape}
                    renderStyle={{width, height}}
                    style={{
                        ...(typeof style === 'object' && style),
                        ...border,
                        backgroundColor,
                    }}
                    testID={`iconButton__content--${id}`}>
                    <Icon testID={`iconButton__icon--${id}`}>{icon}</Icon>
                    <Hovered
                        eventName={eventName}
                        renderStyle={{width: layoutWidth, height: layoutHeight}}
                        shape={shape}
                        underlayColor={underlayColor}
                    />
                </AnimatedContent>
            </TouchableRipple>
        </Container>
    );
};

const ForwardRefIconButton = forwardRef<View, IconButtonProps>((props, ref) => (
    <IconButtonBase {...props} ref={ref} render={render} />
));

export const IconButton: FC<IconButtonProps> = memo(ForwardRefIconButton);
