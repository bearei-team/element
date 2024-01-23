import {FC, useCallback, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
import {EventName, State} from '../../Common/interface';
import {TabItemProps} from './TabItem';
import {useAnimated} from './useAnimated';

export interface RenderProps extends TabItemProps {
    eventName: EventName;
    onEvent: OnEvent;
    onLabelTextLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<ViewStyle & TextStyle> & {
        height: number;
        width: number;
    };
    underlayColor: string;
}

export interface TabItemBaseProps extends TabItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    layout: {} as LayoutRectangle,
    eventName: 'none' as EventName,
};

export const TabItemBase: FC<TabItemBaseProps> = props => {
    const {
        activeKey,
        defaultActiveKey,
        indexKey,
        onActive,
        onLabelTextLayout,
        render,
        ...renderProps
    } = props;

    const [{layout, eventName}, setState] = useImmer(initialState);
    const id = useId();
    const theme = useTheme();
    const active = typeof activeKey === 'string' ? activeKey === indexKey : undefined;
    const defaultActive =
        [typeof defaultActiveKey, typeof indexKey].includes('string') &&
        defaultActiveKey === indexKey;

    const underlayColor =
        active || defaultActive ? theme.palette.primary.primary : theme.palette.surface.onSurface;

    const processLayout = useCallback(
        (event: LayoutChangeEvent) => {
            const nativeEventLayout = event.nativeEvent.layout;

            setState(draft => {
                draft.layout = nativeEventLayout;
            });
        },
        [setState],
    );

    const processPressOut = useCallback(
        (options: Pick<TabItemProps, 'activeKey' | 'indexKey'>) => {
            const {activeKey: itemActiveKey, indexKey: itemIndexKey} = options;
            const responseActive = itemActiveKey !== itemIndexKey;

            if (responseActive) {
                onActive?.(itemIndexKey);
            }
        },
        [onActive],
    );

    const processState = useCallback(
        (processPressOutOptions: Pick<TabItemProps, 'activeKey' | 'indexKey'>) =>
            (_nextState: State, options = {} as OnStateChangeOptions) => {
                const {event, eventName: nextEventName} = options;
                const nextEvent = {
                    layout: () => {
                        processLayout(event as LayoutChangeEvent);
                    },
                    pressOut: () => {
                        processPressOut(processPressOutOptions);
                    },
                };

                nextEvent[nextEventName as keyof typeof nextEvent]?.();

                setState(draft => {
                    draft.eventName = nextEventName;
                });
            },
        [setState, processLayout, processPressOut],
    );

    const processStateChange = useMemo(
        () => processState({activeKey, indexKey}),
        [activeKey, indexKey, processState],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        onStateChange: processStateChange,
    });

    const [{color}] = useAnimated({active, defaultActive});
    const processLabelTextLayout = (event: LayoutChangeEvent) => {
        onLabelTextLayout(event, indexKey ?? id);
    };

    return render({
        ...renderProps,
        eventName,
        id,
        onEvent,
        onLabelTextLayout: processLabelTextLayout,
        onLayout: processLayout,
        renderStyle: {color, height: layout.height, width: layout.width},
        underlayColor,
    });
};
