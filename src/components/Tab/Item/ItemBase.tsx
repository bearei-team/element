import {FC, useId} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {useHandleEvent} from '../../../hooks/useHandleEvent';
import {State} from '../../Common/interface';
import {ItemProps} from './Item';
import {useAnimated} from './useAnimated';

export interface RenderProps extends ItemProps {
    onLabelTextLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<ViewStyle & TextStyle> & {
        height: number;
        width: number;
    };
    state: State;
    underlayColor: string;
}

export interface ItemBaseProps extends ItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    layout: {} as Pick<LayoutRectangle, 'height' | 'width'>,
};

export const ItemBase: FC<ItemBaseProps> = props => {
    const {render, onLayout, onLabelTextLayout, indexKey, active = false, ...renderProps} = props;
    const [{layout}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();
    const underlayColor = theme.palette.surface.onSurface;
    const {color} = useAnimated({active});
    const {state, ...handleEvent} = useHandleEvent({
        ...props,
    });

    const processLayout = (event: LayoutChangeEvent) => {
        const {height, width} = event.nativeEvent.layout;

        setState(draft => {
            draft.layout = {height, width};
        });

        onLayout?.(event);
    };

    const processLabelTextLayout = (event: LayoutChangeEvent) => {
        onLabelTextLayout(event, indexKey ?? id);
    };

    return render({
        ...renderProps,
        ...handleEvent,
        id,
        onLabelTextLayout: processLabelTextLayout,
        onLayout: processLayout,
        renderStyle: {height: layout.height, width: layout.width, color},
        state,
        underlayColor,
    });
};
