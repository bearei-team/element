import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import {IconButton} from '../IconButton/IconButton';
import {SideSheetProps} from './SideSheet';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SideSheetProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerTranslateX: Animated.AnimatedInterpolation<string | number>;
    };
}
export interface SideSheetBaseProps extends SideSheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessEventOptions {
    setState: Updater<typeof initialState>;
}

export type ProcessAnimatedFinishedOptions = Pick<RenderProps, 'visible' | 'onClose' | 'onBack'> &
    ProcessEventOptions;

export interface ProcessEmitOptions extends Pick<RenderProps, 'visible'> {
    sheet: React.JSX.Element;
    id: string;
}

const processAnimatedFinished = ({
    visible,
    setState,
    onClose,
    onBack,
}: ProcessAnimatedFinishedOptions) => {
    if (!visible) {
        return;
    }

    setState(draft => {
        draft.modalVisible = false;
        draft.visible = undefined;
    });

    onClose?.();
    onBack?.();
};

const processClose = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.visible = false;
    });

const processModalShow = ({setState}: ProcessEventOptions) =>
    setState(draft => {
        draft.visible = true;
    });

const processSheetVisible = (sheetVisible: boolean, {setState}: ProcessEventOptions) =>
    setState(draft => {
        if (draft.modalVisible) {
            draft.visible = false;

            return;
        }

        draft.modalVisible = sheetVisible;
    });

const processEmit = ({visible, sheet, id}: ProcessEmitOptions) =>
    emitter.emit('sheet', {id: `search__${id}`, element: visible ? sheet : <></>});

const initialState = {
    modalVisible: undefined as boolean | undefined,
    visible: undefined as boolean | undefined,
};

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
    visible: sheetVisible = false,
    ...renderProps
}) => {
    const [{visible, modalVisible}, setState] = useImmer(initialState);
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
        processSheetVisible(sheetVisible, {setState});
    }, [setState, sheetVisible]);

    useEffect(() => {
        processEmit({id, sheet, visible: modalVisible});
    }, [id, modalVisible, sheet]);

    return <></>;
};
