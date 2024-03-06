import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {Tooltip} from '../Tooltip/Tooltip';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content} from './IconButton.styles';
import {IconButtonBase, IconButtonProps, IconButtonType, RenderProps} from './IconButtonBase';

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
    supportingPosition,
    supportingText,
    underlayColor,
    tooltipVisible,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, height, width, layoutHeight, layoutWidth, ...border} = renderStyle;
    const shape = 'full';

    return (
        <Container
            accessibilityRole="button"
            testID={`iconButton--${id}`}
            renderStyle={{width: layoutWidth, height: layoutHeight}}
            shape={shape}>
            <TouchableRipple shape={shape} underlayColor={underlayColor}>
                <Tooltip
                    {...onEvent}
                    shape={shape}
                    disabled={disabled}
                    supportingPosition={supportingPosition}
                    supportingText={supportingText}
                    type="plain"
                    visible={tooltipVisible}>
                    <AnimatedContent
                        {...contentProps}
                        shape={shape}
                        renderStyle={{width, height}}
                        style={{
                            ...(typeof style === 'object' && style),
                            ...border,
                            backgroundColor,
                        }}
                        testID={`iconButton__content--${id}`}>
                        {icon}
                        <Hovered
                            eventName={eventName}
                            renderStyle={{width: layoutWidth, height: layoutHeight}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </AnimatedContent>
                </Tooltip>
            </TouchableRipple>
        </Container>
    );
};

const ForwardRefIconButton = forwardRef<View, IconButtonProps>((props, ref) => (
    <IconButtonBase {...props} ref={ref} render={render} />
));

export const IconButton: FC<IconButtonProps> = memo(ForwardRefIconButton);
export type {IconButtonProps, IconButtonType};
