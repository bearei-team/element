import {FC, RefAttributes, useCallback, useEffect, useId, useMemo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    ModalProps,
    View,
    ViewProps,
    ViewStyle,
} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {Button} from '../Button/Button';
import {ShapeProps} from '../Common/Common.styles';
import {Icon} from '../Icon/Icon';
import {IconButton} from '../IconButton/IconButton';
import {useAnimated} from './useAnimated';

type SideSheetType = 'side' | 'bottom';
export interface SideSheetProps
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps> {
    back?: boolean;
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    content?: React.JSX.Element;
    footer?: boolean;
    headlineText?: string;
    onBack?: () => void;
    onClose?: () => void;
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void;
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void;
    position?: 'horizontalStart' | 'horizontalEnd';
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    type?: SideSheetType;
    visible?: boolean;
}

export interface RenderProps extends SideSheetProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerTranslateX: Animated.AnimatedInterpolation<string | number>;
    };
}
interface SideSheetBaseProps extends SideSheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    modalVisible?: boolean;
    visible?: boolean;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessAnimatedFinishedOptions = Pick<RenderProps, 'visible' | 'onClose' | 'onBack'> &
    ProcessEventOptions;

interface ProcessEmitOptions extends Pick<RenderProps, 'visible'> {
    sheet: React.JSX.Element;
    id: string;
}

const processAnimatedFinished = ({
    visible,
    setState,
    onClose,
    onBack,
}: ProcessAnimatedFinishedOptions) =>
    visible &&
    setState(draft => {
        draft.modalVisible = false;
        draft.visible = undefined;

        onClose?.();
        onBack?.();
    });

const processClose = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.visible = false;
    });

const processModalShow = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.visible = true;
    });

const processSheetVisible = ({setState}: ProcessEventOptions, sheetVisible?: boolean) =>
    setState(draft => {
        if (draft.modalVisible) {
            draft.visible = false;

            return;
        }

        draft.modalVisible = sheetVisible;
    });

const processEmit = ({visible, sheet, id}: ProcessEmitOptions) =>
    emitter.emit('modal', {id: `sideSheet__${id}`, element: visible ? sheet : <></>});

export const SideSheetBase: FC<SideSheetBaseProps> = ({
    backIcon,
    closeIcon,
    headlineText = 'Title',
    onBack,
    onPrimaryButtonPress,
    onSecondaryButtonPress,
    position = 'horizontalEnd',
    primaryButton,
    primaryButtonLabelText = 'Save',
    render,
    secondaryButton,
    secondaryButtonLabelText = 'Cancel',
    visible: sheetVisible,
    ...renderProps
}) => {
    const [{visible, modalVisible}, setState] = useImmer<InitialState>({
        modalVisible: undefined,
        visible: undefined,
    });

    const id = useId();
    const finished = useCallback(
        () =>
            processAnimatedFinished({
                visible: modalVisible,
                setState,
                onBack,
                onClose: renderProps.onClose,
            }),
        [modalVisible, onBack, renderProps.onClose, setState],
    );

    const [{backgroundColor, innerTranslateX}] = useAnimated({finished, position, visible});
    const onClose = useCallback(() => processClose({setState}), [setState]);
    const onShow = useCallback(() => processModalShow({setState}), [setState]);
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

    const sheet = useMemo(
        () =>
            render({
                ...renderProps,
                backIcon: backIconElement,
                closeIcon: closeIconElement,
                headlineText,
                id,
                onShow,
                position,
                primaryButton: primaryButtonElement,
                renderStyle: {backgroundColor, innerTranslateX},
                secondaryButton: secondaryButtonElement,
                visible: modalVisible,
            }),
        [
            backIconElement,
            backgroundColor,
            closeIconElement,
            headlineText,
            id,
            innerTranslateX,
            modalVisible,
            onShow,
            position,
            primaryButtonElement,
            render,
            renderProps,
            secondaryButtonElement,
        ],
    );

    useEffect(() => {
        processSheetVisible({setState}, sheetVisible);
    }, [setState, sheetVisible]);

    useEffect(() => {
        processEmit({id, sheet, visible: modalVisible});
    }, [id, modalVisible, sheet]);

    return <></>;
};
