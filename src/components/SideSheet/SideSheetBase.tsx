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

export interface ProcessOptions {
    setState?: Updater<typeof initialState>;
}

export type ProcessAnimatedFinishedOptions = Partial<
    Pick<RenderProps, 'visible' | 'onClose' | 'onBack'> & ProcessOptions
>;

const processAnimatedFinished =
    ({visible, setState, onClose, onBack}: ProcessAnimatedFinishedOptions) =>
    () => {
        if (visible) {
            setState?.(draft => {
                draft.modalVisible = false;
                draft.visible = undefined;
            });

            onClose?.();
            onBack?.();
        }
    };

const initialState = {
    modalVisible: undefined as boolean | undefined,
    visible: undefined as boolean | undefined,
};

export const SideSheetBase: FC<SideSheetBaseProps> = ({
    backIcon,
    closeIcon,
    headlineText = 'Title',
    onBack,
    onClose,
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
    const processFinished = useMemo(
        () => processAnimatedFinished({visible: modalVisible, setState, onBack, onClose}),
        [modalVisible, onBack, onClose, setState],
    );

    const [{backgroundColor, innerTranslateX}] = useAnimated({
        finished: processFinished,
        position,
        visible,
    });

    const handleClose = useCallback(() => {
        setState(draft => {
            draft.visible = false;
        });
    }, [setState]);

    const processModalShow = useCallback(() => {
        setState(draft => {
            draft.visible = true;
        });
    }, [setState]);

    const sheet = useMemo(
        () =>
            render({
                ...renderProps,
                backIcon: backIcon ?? (
                    <IconButton
                        icon={<Icon type="filled" name="arrowBack" />}
                        onPressOut={handleClose}
                        type="standard"
                    />
                ),
                closeIcon: closeIcon ?? (
                    <IconButton
                        icon={<Icon type="filled" name="close" />}
                        onPressOut={handleClose}
                        type="standard"
                    />
                ),
                headlineText,
                id,
                primaryButton: primaryButton ?? (
                    <Button
                        labelText={primaryButtonLabelText}
                        onPress={onPrimaryButtonPress}
                        type="filled"
                    />
                ),
                secondaryButton: secondaryButton ?? (
                    <Button
                        labelText={secondaryButtonLabelText}
                        onPress={onSecondaryButtonPress}
                        type="outlined"
                    />
                ),
                onShow: processModalShow,
                position,
                renderStyle: {backgroundColor, innerTranslateX},
                visible: modalVisible,
            }),
        [
            backIcon,
            backgroundColor,
            closeIcon,
            handleClose,
            headlineText,
            id,
            innerTranslateX,
            modalVisible,
            onPrimaryButtonPress,
            onSecondaryButtonPress,
            position,
            primaryButton,
            primaryButtonLabelText,
            processModalShow,
            render,
            renderProps,
            secondaryButton,
            secondaryButtonLabelText,
        ],
    );

    useEffect(() => {
        setState(draft => {
            if (draft.modalVisible) {
                draft.visible = false;

                return;
            }

            draft.modalVisible = sheetVisible;
        });
    }, [setState, sheetVisible]);

    useEffect(() => {
        emitter.emit('sheet', {id, element: sheet});
    }, [id, sheet]);

    return <></>;
};
