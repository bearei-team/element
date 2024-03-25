import {RefAttributes, forwardRef, useId, useMemo} from 'react'
import {ModalProps, View, ViewProps, ViewStyle} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {OnEvent} from '../../../hooks/useOnEvent'
import {Button} from '../../Button/Button'
import {ShapeProps} from '../../Common/Common.styles'
import {Icon} from '../../Icon/Icon'
import {IconButton} from '../../IconButton/IconButton'
import {useAnimated} from './useAnimated'

export interface SheetProps
    extends Partial<
        ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps
    > {
    back?: boolean
    backIcon?: React.JSX.Element
    closeIcon?: React.JSX.Element
    content?: React.JSX.Element
    disabledClose?: boolean
    footer?: boolean
    headlineText?: string
    onClose?: () => void
    onClosed?: () => void
    onPrimaryButtonEvent?: OnEvent
    onSecondaryButtonEvent?: OnEvent
    primaryButton?: React.JSX.Element
    primaryButtonLabelText?: string
    secondaryButton?: React.JSX.Element
    secondaryButtonLabelText?: string
    sheetPosition?: 'horizontalStart' | 'horizontalEnd'
    visible?: boolean

    /**
     * The modal type has a problem with mouseover events being passed through to lower level
     * elements in macOS. This problem is caused by the fact that react-native-macos does not
     * implement the native modal and some of the mechanisms of the macos component itself.
     */
    type?: 'standard' | 'modal'
}

export interface RenderProps extends SheetProps {
    renderStyle: {
        contentAnimatedStyle: AnimatedStyle<ViewStyle>
        innerAnimatedStyle: AnimatedStyle<ViewStyle>
    }
}

interface SheetBaseProps extends SheetProps {
    render: (props: RenderProps) => React.JSX.Element
}

export const SheetBase = forwardRef<View, SheetBaseProps>(
    (
        {
            backIcon,
            closeIcon,
            disabledClose,
            headlineText = 'Title',
            onClose,
            onClosed,
            onPrimaryButtonEvent,
            onSecondaryButtonEvent,
            primaryButton,
            primaryButtonLabelText = 'Save',
            render,
            secondaryButton,
            secondaryButtonLabelText = 'Cancel',
            sheetPosition = 'horizontalEnd',
            type,
            visible,
            ...renderProps
        },
        ref
    ) => {
        const [renderStyle] = useAnimated({
            onClosed,
            sheetPosition,
            type,
            visible
        })

        const id = useId()
        const backIconElement = useMemo(
            () =>
                backIcon ?? (
                    <IconButton
                        icon={
                            <Icon
                                type='filled'
                                name='arrowBack'
                            />
                        }
                        onPressOut={onClose}
                        type='standard'
                    />
                ),
            [backIcon, onClose]
        )

        const closeIconElement = useMemo(
            () =>
                closeIcon ?? (
                    <IconButton
                        disabled={disabledClose}
                        icon={
                            <Icon
                                type='filled'
                                name='close'
                            />
                        }
                        onPressOut={onClose}
                        type='standard'
                    />
                ),
            [closeIcon, disabledClose, onClose]
        )

        const primaryButtonElement = useMemo(
            () =>
                primaryButton ?? (
                    <Button
                        {...onPrimaryButtonEvent}
                        labelText={primaryButtonLabelText}
                        type='filled'
                    />
                ),
            [onPrimaryButtonEvent, primaryButton, primaryButtonLabelText]
        )

        const secondaryButtonElement = useMemo(
            () =>
                secondaryButton ?? (
                    <Button
                        {...onSecondaryButtonEvent}
                        labelText={secondaryButtonLabelText}
                        type='outlined'
                    />
                ),
            [onSecondaryButtonEvent, secondaryButton, secondaryButtonLabelText]
        )

        return render({
            ...renderProps,
            backIcon: backIconElement,
            closeIcon: closeIconElement,
            headlineText,
            id,
            primaryButton: primaryButtonElement,
            ref,
            renderStyle,
            secondaryButton: secondaryButtonElement,
            sheetPosition,
            type
        })
    }
)
