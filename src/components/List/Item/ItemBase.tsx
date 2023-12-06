import {FC, useId} from 'react';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {State} from '../../Common/interface';
import {ItemProps} from './Item';

export interface RenderProps extends ItemProps {
    underlayColor: string;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    state: 'enabled' as State,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {active = false, render, ...renderProps} = props;

    const [{state}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();

    const underlayColor = active
        ? theme.palette.surface.onSurface
        : theme.palette.secondary.onSecondaryContainer;

    const mobile = ['ios', 'android'].includes(theme.OS);

    return render({
        ...renderProps,
        active,
        id,
        state,
        underlayColor,
    });
};
