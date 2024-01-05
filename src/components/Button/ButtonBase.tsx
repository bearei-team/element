import {FC, useCallback, useEffect, useId} from 'react';
import {Animated, TextStyle, ViewStyle} from 'react-native';
import {useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ButtonProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    eventName: EventName;
    elevationLevel: ElevationLevel;
    defaultElevationLevel: ElevationLevel;
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

const processCorrectionCoefficient = (options: Pick<RenderProps, 'type'>) => {
    const {type} = options;
    const nextElevation = type === 'elevated' ? 1 : 0;

    return nextElevation;
};

const initialState = {
    elevationLevel: undefined as ElevationLevel,
    defaultElevationLevel: 0 as ElevationLevel,
    status: 'idle' as ComponentStatus,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        block = false,
        disabled = false,
        icon,
        render,
        type = 'filled',
        labelText = 'Label',
        ...renderProps
    } = props;

    const [{elevationLevel, defaultElevationLevel, status}, setState] =
        useImmer(initialState);

    const id = useId();
    const {underlayColor} = useUnderlayColor({type});

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

            const correctionCoefficient = processCorrectionCoefficient({type});

            setState(draft => {
                draft.elevationLevel = (level[nextState] +
                    correctionCoefficient) as ElevationLevel;
            });
        },
        [setState, type],
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

    const {backgroundColor, borderColor, color} = useAnimated({
        disabled,
        type,
        eventName,
    });

    const {icon: iconElement} = useIcon({eventName, type, icon, disabled});
    const border = useBorder({type, borderColor});

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                type === 'elevated' && (draft.defaultElevationLevel = 1);
                draft.status = 'succeeded';
            });
        }
    }, [setState, status, type]);

    useEffect(() => {
        const setElevationLevel =
            typeof disabled === 'boolean' &&
            status === 'succeeded' &&
            type === 'elevated';

        if (setElevationLevel) {
            setState(draft => {
                draft.elevationLevel = disabled ? 0 : 1;
            });
        }
    }, [disabled, setState, status, type]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        block,
        elevationLevel,
        eventName,
        icon: iconElement,
        defaultElevationLevel,
        id,
        labelText,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            height: layout.height,
            width: layout.width,
        },
    });
};
