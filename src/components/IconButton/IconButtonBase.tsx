import {FC, useId} from 'react';
import {Animated, TextStyle, ViewStyle} from 'react-native';
import {HOOK} from '../../hooks/hook';
import {OnEvent} from '../../hooks/useOnEvent';
import {EventName} from '../Common/interface';
import {IconButtonProps} from './IconButton';
import {useAnimated} from './useAnimated';
import {useBorder} from './useBorder';
import {useIcon} from './useIcon';
import {useUnderlayColor} from './useUnderlayColor';

export interface RenderProps extends IconButtonProps {
    onEvent: OnEvent;
    renderStyle: Animated.WithAnimatedObject<TextStyle & ViewStyle> & {
        height: number;
        width: number;
    };
    eventName: EventName;
}

export interface IconButtonBaseProps extends IconButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const IconButtonBase: FC<IconButtonBaseProps> = props => {
    const {
        disabled = false,
        icon,
        render,
        type = 'filled',
        ...renderProps
    } = props;

    const id = useId();
    const [underlayColor] = useUnderlayColor({type});
    const {layout, eventName, ...onEvent} = HOOK.useOnEvent({
        ...props,
        disabled,
    });

    const {backgroundColor, borderColor} = useAnimated({
        disabled,
        type,
        eventName,
    });

    const {icon: iconElement} = useIcon({eventName, type, icon, disabled});
    const border = useBorder({borderColor});

    return render({
        ...renderProps,
        eventName,
        icon: iconElement,
        id,
        onEvent,
        type,
        underlayColor,
        renderStyle: {
            ...border,
            backgroundColor,
            height: layout.height,
            width: layout.width,
        },
    });
};
