import mitt from 'mitt';
import React, {FC} from 'react';
import {Updater, useImmer} from 'use-immer';

interface Modal {
    element: React.JSX.Element;
    id: string;
}

type EmitterEvent = {
    modal: Modal;
};

interface InitialState {
    modals: Modal[];
}

interface ProcessModalEventOptions {
    setState: Updater<InitialState>;
}

const processModal = (modal: Modal, {setState}: ProcessModalEventOptions) => {
    const {id, element} = modal;

    setState(draft => {
        const exist = draft.modals.some(item => item.id === id);

        if (exist) {
            draft.modals = draft.modals.map(item => (item.id === id ? {...item, element} : item));

            return;
        }

        draft.modals = [...draft.modals, modal];
    });
};

const Item: FC<{element: React.JSX.Element}> = ({element}) => <>{element}</>;

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{modals}, setState] = useImmer<InitialState>({modals: []});

    emitter.on('modal', modal => processModal(modal, {setState}));

    return (
        <>
            {modals.map(({element, id}) => (
                <Item key={id} element={element} />
            ))}
        </>
    );
};
