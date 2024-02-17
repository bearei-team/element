import mitt from 'mitt';
import React, {FC} from 'react';
import {Updater, useImmer} from 'use-immer';

export interface Sheet {
    element: React.JSX.Element;
    id: string;
}

export type EmitterEvent = {
    sheet: Sheet;
};

export interface InitialState {
    sheets: Sheet[];
}

export interface ProcessSheetEventOptions {
    setState: Updater<InitialState>;
}

const processSheet = (sheet: Sheet, {setState}: ProcessSheetEventOptions) => {
    const {id, element} = sheet;

    setState(draft => {
        const exist = draft.sheets.some(item => item.id === id);

        if (exist) {
            draft.sheets = draft.sheets.map(item => (item.id === id ? {...item, element} : item));

            return;
        }

        draft.sheets = [...draft.sheets, sheet];
    });
};

const Item: FC<{element: React.JSX.Element}> = ({element}) => <>{element}</>;

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{sheets}, setState] = useImmer<InitialState>({sheets: []});

    emitter.on('sheet', sheet => processSheet(sheet, {setState}));

    return (
        <>
            {sheets.map(({element, id}) => (
                <Item key={id} element={element} />
            ))}
        </>
    );
};
