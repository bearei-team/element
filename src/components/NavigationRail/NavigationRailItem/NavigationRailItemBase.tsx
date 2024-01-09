import {FC, cloneElement, useCallback, useId, useMemo, useState} from 'react';
import {
    Animated,
    GestureResponderEvent,
    LayoutAnimation,
    LayoutChangeEvent,
    LayoutRectangle,
    NativeTouchEvent,
    TextStyle,
    ViewStyle,
} from 'react-native';
import {useTheme} from 'styled-components/native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../../hooks/useOnEvent';
import {EventName, State} from '../../Common/interface';
import {Icon} from '../../Icon/Icon';
import {NavigationRailItemProps} from './NavigationRailItem';
import {useAnimated} from './useAnimated';

export interface RenderProps extends NavigationRailItemProps {
    activeColor: string;
    defaultActive?: boolean;
    activeLocation?: Pick<NativeTouchEvent, 'locationX' | 'locationY'>;
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    underlayColor: string;
    eventName: EventName;
}

export interface NavigationRailItemBaseProps extends NavigationRailItemProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    activeLocation: {} as Pick<NativeTouchEvent, 'locationX' | 'locationY'>,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
};

export const NavigationRailItemBase: FC<
    NavigationRailItemBaseProps
> = props => {
    const {
        active,
        defaultActive,
        activeIcon = <Icon type="filled" name="circle" />,
        block = false,
        icon = <Icon type="outlined" name="circle" />,
        render,
        ...renderProps
    } = props;

    const [{layout, eventName, activeLocation}, setState] =
        useImmer(initialState);

    const theme = useTheme();
    const activeColor = theme.palette.secondary.secondaryContainer;
    const id = useId();
    const underlayColor = theme.palette.surface.onSurface;
    const {scale, color} = useAnimated({active, block, defaultActive});

    /**
     * TODO: 使用高度非原生动画处理.
     */
    const [labheight, setHeight] = useState(24);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const toggleHeight = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        console.info(7777);

        setHeight(labheight === 24 ? 0 : 24);
    };

    const processStateChange = useCallback(
        (_nextState: State, options = {} as OnStateChangeOptions) => {
            const {event, eventName: nextEventName} = options;
            const {locationX = 0, locationY = 0} =
                nextEventName === 'pressOut'
                    ? (event as GestureResponderEvent).nativeEvent
                    : {};

            if (nextEventName === 'layout') {
                const nativeEventLayout = (event as LayoutChangeEvent)
                    .nativeEvent.layout;

                setState(draft => {
                    draft.layout = nativeEventLayout;
                });
            }

            if (nextEventName === 'pressOut') {
                toggleHeight();
            }

            setState(draft => {
                draft.eventName = nextEventName;

                if (nextEventName === 'pressOut') {
                    draft.activeLocation = {locationX, locationY};
                }
            });
        },
        [setState, toggleHeight],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled: false,
        onStateChange: processStateChange,
    });

    const activeIconElement = useMemo(
        () => cloneElement(activeIcon, {eventName}),
        [activeIcon, eventName],
    );

    const iconElement = useMemo(
        () => cloneElement(icon, {eventName}),
        [eventName, icon],
    );

    return render({
        ...renderProps,
        active,
        activeColor,
        activeIcon: activeIconElement,
        activeLocation,
        defaultActive,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        renderStyle: {
            height: layout?.height,
            transform: [{scaleY: scale}],
            width: layout?.width,
            color,
            labheight,
        },
        underlayColor,
    });
};
