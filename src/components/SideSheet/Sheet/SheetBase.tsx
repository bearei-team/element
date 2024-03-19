import {RefAttributes, forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    ModalProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {Button} from '../../Button/Button';
import {ShapeProps} from '../../Common/Common.styles';
import {ComponentStatus} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {IconButton} from '../../IconButton/IconButton';
import {useAnimated} from './useAnimated';

export interface SheetProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps> {
    back?: boolean;
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    content?: React.JSX.Element;
    disabledClose?: boolean;
    footer?: boolean;
    headlineText?: string;
    onClose?: () => void;
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void;
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void;
    position?: 'horizontalStart' | 'horizontalEnd';
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    visible?: boolean;

    /**
     * The modal type has a problem with mouseover events being passed through to lower level
     * elements in macOS. This problem is caused by the fact that react-native-macos does not
     * implement the native modal and some of the mechanisms of the macos component itself.
     */
    type?: 'standard' | 'modal';
}

export interface RenderProps extends SheetProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerTranslateX: Animated.AnimatedInterpolation<string | number>;
    };
}

interface InitialState {
    status: ComponentStatus;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

const processVisible = ({setState}: ProcessEventOptions, value?: boolean) =>
    typeof value === 'boolean' &&
    setState(draft => {
        const nextStatus = value ? 'succeeded' : 'idle';

        draft.status !== nextStatus && (draft.status = nextStatus);
    });

interface SheetBaseProps extends SheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const SheetBase = forwardRef<View, SheetBaseProps>(
    (
        {
            backIcon,
            closeIcon,
            disabledClose,
            headlineText = 'Title',
            onClose,
            onPrimaryButtonPress,
            onSecondaryButtonPress,
            position = 'horizontalEnd',
            primaryButton,
            primaryButtonLabelText = 'Save',
            render,
            secondaryButton,
            secondaryButtonLabelText = 'Cancel',
            type,
            visible,
            ...renderProps
        },
        ref,
    ) => {
        const [{status}, setState] = useImmer<InitialState>({status: 'idle'});
        console.info(status);
        const onVisible = useCallback(
            (value?: boolean) => processVisible({setState}, value),
            [setState],
        );

        const [renderStyle] = useAnimated({
            position,
            visible,
            type,
            onVisible,
        });

        const id = useId();
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
                        disabled={disabledClose}
                        icon={<Icon type="filled" name="close" />}
                        onPressOut={onClose}
                        type="standard"
                    />
                ),
            [closeIcon, disabledClose, onClose],
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

        useEffect(() => {
            visible && onVisible(visible);
        }, [onVisible, visible]);

        if (status === 'idle') {
            return <></>;
        }

        return render({
            ...renderProps,
            backIcon: backIconElement,
            closeIcon: closeIconElement,
            headlineText,
            id,
            position,
            primaryButton: primaryButtonElement,
            ref,
            renderStyle,
            secondaryButton: secondaryButtonElement,
            type,
        });
    },
);
