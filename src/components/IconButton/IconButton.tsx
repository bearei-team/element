import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {Tooltip} from '../Tooltip/Tooltip';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content} from './IconButton.styles';
import {IconButtonBase, IconButtonProps, IconButtonType, RenderProps} from './IconButtonBase';

/**
 * TODO: Selected
 */

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
            renderStyle={{width: layoutWidth, height: layoutHeight}}>
            <Tooltip
                disabled={disabled}
                eventName={eventName}
                shape={shape}
                supportingPosition={supportingPosition}
                supportingText={supportingText}
                type="plain"
                visible={tooltipVisible}>
                <TouchableRipple
                    {...onEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}
                    style={{
                        ...(typeof style === 'object' && style),
                        ...border,
                        backgroundColor,
                    }}>
                    <Content
                        {...contentProps}
                        shape={shape}
                        renderStyle={{width, height}}
                        testID={`iconButton__content--${id}`}>
                        {icon}
                        <Hovered
                            eventName={eventName}
                            renderStyle={{width: layoutWidth, height: layoutHeight}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </Content>
                </TouchableRipple>
            </Tooltip>
        </Container>
    );
};

const ForwardRefIconButton = forwardRef<View, IconButtonProps>((props, ref) => (
    <IconButtonBase {...props} ref={ref} render={render} />
));

export const IconButton: FC<IconButtonProps> = memo(ForwardRefIconButton);
export type {IconButtonProps, IconButtonType};
