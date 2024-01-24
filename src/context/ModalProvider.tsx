import mitt from 'mitt';
import React, {FC} from 'react';
import {useImmer} from 'use-immer';

export interface Sheet {
    element: React.JSX.Element;
    id: string;
}

export type EmitterEvent = {
    sheet: Sheet;
};

const initialState = {
    sheets: [] as Sheet[],
};

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{sheets}, setState] = useImmer(initialState);

    emitter.on('sheet', sheet => {
        const {id, element} = sheet;

        setState(draft => {
            const exist = draft.sheets.some(item => item.id === id);

            if (exist) {
                draft.sheets = draft.sheets.map(item =>
                    item.id === id ? {...item, element} : item,
                );

                return;
            }

            draft.sheets = [...draft.sheets, sheet];
        });
    });

    return <>{sheets.map(({element}) => element)}</>;
};
