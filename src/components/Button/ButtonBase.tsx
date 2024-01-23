import {FC, useCallback, useEffect, useId, useMemo} from 'react';
import {Animated, LayoutChangeEvent, LayoutRectangle, TextStyle, ViewStyle} from 'react-native';
import {Updater, useImmer} from 'use-immer';
import {HOOK} from '../../hooks/hook';
import {OnEvent, OnStateChangeOptions} from '../../hooks/useOnEvent';
import {ComponentStatus, EventName, State} from '../Common/interface';
import {ElevationLevel} from '../Elevation/Elevation';
import {ButtonProps} from './Button';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends ButtonProps {
    defaultElevation: ElevationLevel;
    elevation: ElevationLevel;
    eventName: EventName;
    onEvent: OnEvent;
    onContentLayout: (event: LayoutChangeEvent) => void;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
        contentWidth: number;
        contentHeight: number;
    };
}

export interface ButtonBaseProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface ProcessOptions {
    setState?: Updater<typeof initialState>;
}

export type ProcessElevationOptions = Partial<Pick<RenderProps, 'type'> & ProcessOptions>;
export type ProcessLayoutOptions = Partial<Pick<RenderProps, 'type' | 'block'> & ProcessOptions>;

const processCorrectionCoefficient = (options: Pick<RenderProps, 'type'>) => {
    const {type} = options;
    const nextElevation = type === 'elevated' ? 1 : 0;

    return nextElevation;
};

const processElevation = (
    nextState: State,
    {type = 'filled', setState}: ProcessElevationOptions,
) => {
    const elevationType = ['elevated', 'filled', 'tonal'].includes(type);

    if (elevationType) {
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
            draft.elevation = (level[nextState] + correctionCoefficient) as ElevationLevel;
        });
    }
};

const processLayout = (event: LayoutChangeEvent, options: ProcessLayoutOptions) => {
    const nativeEventLayout = event.nativeEvent.layout;

    if (buttonBlock) {
        setState(draft => {
            draft.layout = nativeEventLayout;
        });
    }
};

const processState = (processStateChangeOptions: Pick<ButtonProps, 'block' | 'type'>) => {
    const {block: buttonBlock, type: buttonType} = processStateChangeOptions;

    return (nextState: State, options = {} as OnStateChangeOptions) => {
        const {event, eventName: nextEventName} = options;

        if (nextEventName === 'layout') {
            processLayout(event as LayoutChangeEvent, buttonBlock);
        }

        processElevation(nextState, buttonType);

        setState(draft => {
            draft.eventName = nextEventName;
        });
    };
};

const initialState = {
    defaultElevation: undefined as ElevationLevel,
    elevation: undefined as ElevationLevel,
    eventName: 'none' as EventName,
    layout: {} as LayoutRectangle,
    contentLayout: {} as LayoutRectangle,
    status: 'idle' as ComponentStatus,
};

export const ButtonBase: FC<ButtonBaseProps> = props => {
    const {
        block,
        disabled,
        icon,
        labelText = 'Label',
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const [{defaultElevation, elevation, eventName, layout, status, contentLayout}, setState] =
        useImmer(initialState);

    const id = useId();
    const [underlayColor] = useUnderlayColor({type});

    const processContentLayout = useCallback(
        (event: LayoutChangeEvent, block: boolean) => {
            const nativeEventLayout = event.nativeEvent.layout;

            if (!block) {
                setState(draft => {
                    draft.contentLayout = nativeEventLayout;
                });
            }
        },
        [setState],
    );

    const processState = useCallback(
        (processStateChangeOptions: Pick<ButtonProps, 'block' | 'type'>) => {
            const {block: buttonBlock, type: buttonType} = processStateChangeOptions;

            return (nextState: State, options = {} as OnStateChangeOptions) => {
                const {event, eventName: nextEventName} = options;

                if (nextEventName === 'layout') {
                    processLayout(event as LayoutChangeEvent, buttonBlock);
                }

                processElevation(nextState, buttonType);

                setState(draft => {
                    draft.eventName = nextEventName;
                });
            };
        },
        [setState, processLayout],
    );

    const processStateChange = useMemo(
        () => processState({block, type}),
        [block, processState, type],
    );

    const [onEvent] = HOOK.useOnEvent({
        ...props,
        disabled,
        onStateChange: processStateChange,
    });

    const [{backgroundColor, borderColor, color}] = useAnimated({
        disabled,
        eventName,
        type,
    });

    const [iconElement] = useIcon({eventName, type, icon, disabled});
    const [border] = useBorder({type, borderColor});

    useEffect(() => {
        if (status === 'idle') {
            setState(draft => {
                type === 'elevated' && (draft.defaultElevation = 1);
                draft.status = 'succeeded';
            });
        }
    }, [setState, status, type]);

    useEffect(() => {
        const setElevation = typeof disabled === 'boolean' && type === 'elevated';

        if (setElevation) {
            setState(draft => {
                draft.elevation = disabled ? 0 : 1;
            });
        }
    }, [disabled, setState, type]);

    if (status === 'idle') {
        return <></>;
    }

    return render({
        ...renderProps,
        block,
        defaultElevation,
        disabled,
        elevation,
        eventName,
        icon: iconElement,
        id,
        labelText,
        onContentLayout: processContentLayout,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            color,
            contentHeight: contentLayout.height,
            contentWidth: contentLayout.width,
            height: layout.height,
            width: layout.width,
        },
    });
};
