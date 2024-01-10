import mitt from 'mitt';
import React, {FC} from 'react';
import {useImmer} from 'use-immer';

export type EmitterEvent = {
    sheet: React.JSX.Element;
};

export const emitter = mitt<EmitterEvent>();
export const ModalProvider: FC<unknown> = () => {
    const [{children}, setSheet] = useImmer({
        children: <></>,
    });

    emitter.on('sheet', sheet => {
        console.info(sheet);
        setSheet(draft => {
            draft.children = sheet;
        });
    });

    return <>{children}</>;
};
