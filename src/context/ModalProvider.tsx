import mitt from 'mitt';
import React, {FC} from 'react';
import {useImmer} from 'use-immer';

export type EmitterEvent = {
    sheet: React.JSX.Element;
};

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{sheet}, setSheet] = useImmer({
        sheet: <></>,
    });

    emitter.on('sheet', e => {
        setSheet(draft => {
            draft.sheet = e;
        });
    });

    return <>{sheet}</>;
};
