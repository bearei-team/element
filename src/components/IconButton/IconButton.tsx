import {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import {Tooltip} from '../Tooltip/Tooltip'
import {TouchableRipple} from '../TouchableRipple/TouchableRipple'
import {Hovered} from '../Underlay/Hovered'
import {Container, Content} from './IconButton.styles'
import {
    IconButtonBase,
    IconButtonProps,
    IconButtonType,
    RenderProps
} from './IconButtonBase'

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
    const {backgroundColor, height, width, ...border} = renderStyle
    const shape = 'full'

    return (
        <Container
            accessibilityRole='button'
            testID={`iconButton--${id}`}
            renderStyle={{width, height}}
        >
            <Tooltip
                disabled={disabled}
                eventName={eventName}
                supportingPosition={supportingPosition}
                supportingText={supportingText}
                type='plain'
                visible={tooltipVisible}
            >
                <TouchableRipple
                    {...onEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}
                    style={{
                        ...(typeof style === 'object' && style),
                        ...border,
                        backgroundColor
                    }}
                >
                    <Content
                        {...contentProps}
                        renderStyle={{width, height}}
                        testID={`iconButton__content--${id}`}
                    >
                        {icon}

                        <Hovered
                            eventName={eventName}
                            underlayColor={underlayColor}
                        />
                    </Content>
                </TouchableRipple>
            </Tooltip>
        </Container>
    )
}

const ForwardRefIconButton = forwardRef<View, IconButtonProps>((props, ref) => (
    <IconButtonBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const IconButton: FC<IconButtonProps> = memo(ForwardRefIconButton)
export type {IconButtonProps, IconButtonType}
