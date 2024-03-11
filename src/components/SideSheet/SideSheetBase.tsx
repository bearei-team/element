import {forwardRef, useCallback, useEffect, useId, useMemo} from 'react';
import {View} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {emitter} from '../../context/ModalProvider';
import {SheetProps} from './Sheet/Sheet';

export interface SideSheetProps extends SheetProps {
    defaultVisible?: boolean;
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

type ProcessEmitOptions = Pick<RenderProps, 'visible' | 'id'>;
type ProcessCloseOptions = Pick<RenderProps, 'onClose'> & ProcessEventOptions;
type ProcessVisibleOptions = ProcessEventOptions & Pick<RenderProps, 'onOpen'>;

const processClose = ({setState, onClose}: ProcessCloseOptions) => {
    setState(draft => {
        if (draft.visible === false) {
            return;
        }

        draft.visible = false;
    });

    onClose?.();
};

const processVisible = ({setState, onOpen}: ProcessVisibleOptions, visible?: boolean) => {
    if (typeof visible !== 'boolean') {
        return;
    }

    setState(draft => {
        if (draft.visible === visible) {
            return;
        }

        draft.visible = visible;
    });

    visible && onOpen?.();
};

const processEmit = (sheet: React.JSX.Element, {visible, id}: ProcessEmitOptions) =>
    typeof visible === 'boolean' && emitter.emit('modal', {id: `sideSheet__${id}`, element: sheet});

const processUnmount = (id: string) =>
    emitter.emit('modal', {id: `sideSheet__${id}`, element: undefined});

export const SideSheetBase = forwardRef<View, SideSheetBaseProps>(
    (
        {
            defaultVisible,
            onClose: onCloseSource,
            onOpen,
            render,
            visible: visibleSource,
            ...renderProps
        },
        ref,
    ) => {
        const [{visible}, setState] = useImmer<InitialState>({
            visible: undefined,
        });

        const id = useId();
        const onClose = useCallback(
            () => processClose({setState, onClose: onCloseSource}),
            [onCloseSource, setState],
        );

        const sheet = useMemo(
            () => render({...renderProps, id, visible, onClose, ref}),
            [id, onClose, ref, render, renderProps, visible],
        );

        useEffect(() => {
            processVisible({setState, onOpen}, visibleSource ?? defaultVisible);
        }, [setState, onOpen, visibleSource, defaultVisible]);

        useEffect(() => {
            processEmit(sheet, {id, visible});
        }, [id, sheet, visible]);

        useEffect(() => {
            return () => processUnmount(id);
        }, [id]);

        return <></>;
    },
);
