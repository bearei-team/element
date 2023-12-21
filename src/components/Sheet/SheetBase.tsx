import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, GestureResponderEvent, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import {SheetProps} from './Sheet';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SheetProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {
        innerTranslateX: Animated.AnimatedInterpolation<string | number>;
    };
}
export interface SheetBaseProps extends SheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    modalVisible: false,
    visible: false,
};

export const SheetBase: FC<SheetBaseProps> = props => {
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
            !draft.modalVisible && (draft.modalVisible = false);
        });
    }, [setState]);

    const {backgroundColor, innerTranslateX} = useAnimated({
        finished: processAnimatedFinished,
        position,
        visible,
    });

    const handleClose = useCallback(
        (event: GestureResponderEvent) => {
            onClose?.(event);
            onBack?.(event);
            setState(draft => {
                draft.visible = false;
            });
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
                    <Button
                        category="icon"
                        icon={<Icon type="filled" name="arrowBack" />}
                        onPress={handleClose}
                        type="text"
                    />
                ),
                closeIcon: closeIcon ?? (
                    <Button
                        category="icon"
                        icon={<Icon type="filled" name="close" />}
                        onPress={handleClose}
                        type="text"
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
                shape: 'large',
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
