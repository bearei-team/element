import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, TextStyle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent} from '../../hooks/useOnEvent';
import {EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {FABProps} from './FAB';
import {useAnimated} from './useAnimated';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends FABProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    eventName: EventName;
    elevationLevel: ElevationLevel;
}

export interface FABBaseProps extends FABProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const initialState = {
    elevationLevel: 3 as ElevationLevel,
};

export const FABBase: FC<FABBaseProps> = props => {
    const {
        disabled = false,
        icon,
        render,
        type = 'primary',
        ...renderProps
    } = props;

    const [{elevationLevel}, setState] = useImmer(initialState);
    const id = useId();
    const [underlayColor] = useUnderlayColor({type});

    const processElevation = useCallback(
        (nextState: State) => {
            const level = {
                disabled: 0,
                enabled: 0,
                error: 0,
                focused: 0,
                hovered: 1,
                longPressIn: 0,
                pressIn: 0,
            };

            setState(draft => {
                draft.elevationLevel = (level[nextState] + 3) as ElevationLevel;
            });
        },
        [setState],
    );

    const processStateChange = useCallback(
        (nextState: State) => {
            const elevationType = ['elevated', 'filled', 'tonal'].includes(
                type,
            );

            elevationType && processElevation(nextState);
        },
        [type, processElevation],
    );

    const {layout, eventName, ...onEvent} = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
    });

    const {backgroundColor, color} = useAnimated({
        disabled,
        type,
    });

    const {icon: iconElement} = useIcon({eventName, type, icon, disabled});

    useEffect(() => {
        const elevation = disabled ? 0 : 1;

        setState(draft => {
            draft.elevationLevel = elevation;
        });
    }, [disabled, setState, type]);

    return render({
        ...renderProps,
        elevationLevel,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            backgroundColor,
            color,
            height: layout.height,
            width: layout.width,
        },
    });
};
