import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, GestureResponderEvent, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {Button} from '../Button/Button';
import {SheetProps} from './Sheet';

import {Icon} from '../Icon/Icon';
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
    visible: false,
    modalVisible: false,
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

    const handleClose = (event: GestureResponderEvent) => {
        onClose?.(event);
        onBack?.(event);
        setState(draft => {
            draft.visible = false;
        });
    };

    const processModalShow = () => {
        setState(draft => {
            draft.visible = true;
        });
    };

    useEffect(() => {
        setState(draft => {
            draft.modalVisible = sheetVisible;
        });
    }, [setState, sheetVisible]);

    return render({
        ...renderProps,
        backIcon: backIcon ?? (
            <Button
                category="icon"
                icon={<Icon type="filled" name="arrowBack" />}
                type="text"
                onPress={handleClose}
            />
        ),
        closeIcon: closeIcon ?? (
            <Button
                category="icon"
                icon={<Icon type="filled" name="close" />}
                type="text"
                onPress={handleClose}
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
        renderStyle: {
            backgroundColor,
            innerTranslateX,
        },
        position,
        visible: modalVisible,
    });
};
