import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, GestureResponderEvent, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
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

const initialState = {
    modalVisible: false,
    visible: false,
};

export const SideSheetBase: FC<SideSheetBaseProps> = props => {
    const {
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
    } = props;

    const [{visible, modalVisible}, setState] = useImmer(initialState);
    const id = useId();

    const processAnimatedFinished = useCallback(() => {
        setState(draft => {
            if (!draft.modalVisible) {
                draft.modalVisible = false;
            }
        });
    }, [setState]);

    const {backgroundColor, innerTranslateX} = useAnimated({
        finished: processAnimatedFinished,
        position,
        visible,
    });

    const handleClose = useCallback(
        (event: GestureResponderEvent) => {
            setState(draft => {
                draft.visible = false;
            });

            onClose?.(event);
            onBack?.(event);
        },
        [onBack, onClose, setState],
    );

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
            draft.modalVisible = sheetVisible;
        });

        emitter.emit('sheet', sheet);
    }, [setState, sheet, sheetVisible]);

    return <></>;
};
