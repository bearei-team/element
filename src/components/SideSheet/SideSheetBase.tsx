import {FC, useCallback, useEffect, useId, useMemo} from 'react';
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
    destroy?: boolean;
    visible?: boolean;
}

interface ProcessEventOptions {
    setState: Updater<InitialState>;
}

type ProcessAnimatedFinishedOptions = Pick<RenderProps, 'visible' | 'onClose'> &
    ProcessEventOptions;

type ProcessEmitOptions = Pick<RenderProps, 'visible' | 'id'> & Pick<InitialState, 'destroy'>;
type ProcessCloseOptions = Pick<RenderProps, 'onClose'> & ProcessEventOptions;
type ProcessVisibleOptions = ProcessEventOptions & Pick<RenderProps, 'onOpen'>;

const processExitAnimatedFinished = ({setState}: ProcessAnimatedFinishedOptions) =>
    setState(draft => {
        draft.visible === false && (draft.destroy = true);
    });

const processClose = ({setState, onClose}: ProcessCloseOptions) =>
    setState(draft => {
        if (draft.visible === false) {
            return;
        }

        draft.visible = false;

        onClose?.();
    });

const processVisible = ({setState, onOpen}: ProcessVisibleOptions, visible?: boolean) =>
    typeof visible === 'boolean' &&
    setState(draft => {
        if (draft.visible === visible) {
            return;
        }

        draft.visible = visible;

        if (visible) {
            typeof draft.destroy === 'boolean' && (draft.destroy = false);
            onOpen?.();
        }
    });

const processEmit = (sheet: React.JSX.Element, {visible, id}: ProcessEmitOptions) =>
    typeof visible === 'boolean' && emitter.emit('modal', {id: `sideSheet__${id}`, element: sheet});

export const SideSheetBase: FC<SideSheetBaseProps> = ({
    defaultVisible,
    onClose: onCloseSource,
    onOpen,
    render,
    visible: visibleSource,
    ...renderProps
}) => {
    const [{visible, destroy}, setState] = useImmer<InitialState>({
        destroy: undefined,
        visible: undefined,
    });

    const id = useId();
    const onExitAnimatedFinished = useCallback(
        () => processExitAnimatedFinished({setState}),
        [setState],
    );

    const onClose = useCallback(
        () => processClose({setState, onClose: onCloseSource}),
        [onCloseSource, setState],
    );

    const sheet = useMemo(
        () => render({...renderProps, id, visible, onClose, onExitAnimatedFinished, destroy}),
        [destroy, id, onClose, onExitAnimatedFinished, render, renderProps, visible],
    );

    useEffect(() => {
        processVisible({setState, onOpen}, visibleSource ?? defaultVisible);
    }, [setState, onOpen, visibleSource, defaultVisible]);

    useEffect(() => {
        processEmit(sheet, {id, visible, destroy});
    }, [destroy, id, sheet, visible]);

    return <></>;
};
