import mitt from 'mitt';
import React, {FC} from 'react';
import {useImmer} from 'use-immer';

export type Sheet = {id: string; element: React.JSX.Element};

export type EmitterEvent = {
    sheet: {
        id: string;
        element: React.JSX.Element;
    };
};

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{sheets}, setSheet] = useImmer({
        sheets: [] as Sheet[],
    });

    emitter.on('sheet', sheet => {
        const {id, element} = sheet;

        setSheet(draft => {
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
