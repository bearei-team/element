import {FC, RefAttributes, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    ModalProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Button} from '../../Button/Button';
import {ShapeProps} from '../../Common/Common.styles';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {useAnimated} from './useAnimated';

type SheetType = 'side' | 'bottom';
export interface SheetProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps> {
    back?: boolean;
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    content?: React.JSX.Element;
    destroy?: boolean;
    footer?: boolean;
    headlineText?: string;
    onClose?: () => void;
    onExitAnimatedFinished?: () => void;
    onOpen?: () => void;
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void;
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void;
    position?: 'horizontalStart' | 'horizontalEnd';
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    type?: SheetType;
    visible?: boolean;
}

export interface RenderProps extends SheetProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerTranslateX: Animated.AnimatedInterpolation<string | number>;
    };
}
interface SheetBaseProps extends SheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const SheetBase: FC<SheetBaseProps> = ({
    backIcon,
    closeIcon,
    headlineText = 'Title',
    onClose,
    onExitAnimatedFinished,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    position = 'horizontalEnd',
    primaryButton,
    primaryButtonLabelText = 'Save',
    render,
    secondaryButton,
    secondaryButtonLabelText = 'Cancel',
    visible,
    ...renderProps
}) => {
    const [{backgroundColor, innerTranslateX}] = useAnimated({
        onExitAnimatedFinished,
        position,
        visible,
    });

    const backIconElement = useMemo(
        () =>
            backIcon ?? (
                <IconButton
                    icon={<Icon type="filled" name="arrowBack" />}
                    onPressOut={onClose}
                    type="standard"
                />
            ),
        [backIcon, onClose],
    );

    const closeIconElement = useMemo(
        () =>
            closeIcon ?? (
                <IconButton
                    icon={<Icon type="filled" name="close" />}
                    onPressOut={onClose}
                    type="standard"
                />
            ),
        [closeIcon, onClose],
    );

    const primaryButtonElement = useMemo(
        () =>
            primaryButton ?? (
                <Button
                    labelText={primaryButtonLabelText}
                    onPress={onPrimaryButtonPress}
                    type="filled"
                />
            ),
        [onPrimaryButtonPress, primaryButton, primaryButtonLabelText],
    );

    const secondaryButtonElement = useMemo(
        () =>
            secondaryButton ?? (
                <Button
                    labelText={secondaryButtonLabelText}
                    onPress={onSecondaryButtonPress}
                    type="outlined"
                />
            ),
        [onSecondaryButtonPress, secondaryButton, secondaryButtonLabelText],
    );

    return render({
        ...renderProps,
        backIcon: backIconElement,
        closeIcon: closeIconElement,
        headlineText,
        position,
        primaryButton: primaryButtonElement,
        renderStyle: {backgroundColor, innerTranslateX},
        secondaryButton: secondaryButtonElement,
        visible,
    });
};
