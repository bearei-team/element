import {forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {View} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {SheetProps} from './Sheet/Sheet';

export interface SideSheetProps extends SheetProps {
    defaultVisible?: boolean;
    onOpen?: () => void;
}

export type RenderProps = SideSheetProps;
interface SideSheetBaseProps extends SideSheetProps {
    render: (props: RenderProps) => React.JSX.Element;
}

interface InitialState {
    visible?: boolean;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessEmitOptions = Pick<RenderProps, 'visible' | 'id' | 'type'>;
type ProcessCloseOptions = Pick<RenderProps, 'onClose'> & ProcessEventOptions;
type ProcessVisibleOptions = ProcessEventOptions & Pick<RenderProps, 'onOpen'>;

const processClose = ({setState, onClose}: ProcessCloseOptions) => {
    setState(draft => {
        draft.visible !== false && (draft.visible = false);
    });

    onClose?.();
};

const processVisible = ({setState, onOpen}: ProcessVisibleOptions, visible?: boolean) => {
    if (typeof visible !== 'boolean') {
        return;
    }

    setState(draft => {
        draft.visible !== visible && (draft.visible = visible);
    });

    visible && onOpen?.();
};

const processEmit = (sheet: React.JSX.Element, {visible, id, type}: ProcessEmitOptions) =>
    typeof visible === 'boolean' &&
    type === 'modal' &&
    emitter.emit('modal', {id: `sideSheet__${id}`, element: sheet});

const processUnmount = (id: string, {type}: Pick<RenderProps, 'type'>) =>
    type === 'modal' && emitter.emit('modal', {id: `sideSheet__${id}`, element: undefined});

export const SideSheetBase = forwardRef<View, SideSheetBaseProps>(
    (
        {
            defaultVisible,
            onClose: onCloseSource,
            onOpen,
            render,
            type = 'modal',
            visible: visibleSource,
            ...renderProps
        },
        ref,
    ) => {
        const [{visible}, setState] = useImmer<InitialState>({
            visible: undefined,
        });

        const id = useId();
        const onVisible = useCallback(
            (value?: boolean) => processVisible({setState, onOpen}, value),
            [onOpen, setState],
        );

        const onClose = useCallback(
            () => processClose({setState, onClose: onCloseSource}),
            [onCloseSource, setState],
        );

        const sheet = useMemo(
            () => render({...renderProps, visible, onClose, type, ref}),
            [onClose, ref, render, renderProps, type, visible],
        );

        useEffect(() => {
            onVisible(visibleSource ?? defaultVisible);
        }, [defaultVisible, onVisible, visibleSource]);

        useEffect(() => {
            processEmit(sheet, {id, visible, type});
        }, [id, sheet, visible, type]);

        useEffect(() => {
            return () => {
                processUnmount(id, {type});
            };
        }, [id, type]);

        return type === 'standard' ? sheet : <></>;
    },
);
