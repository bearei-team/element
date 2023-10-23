import {FC, useId} from 'react';
import {MouseEvent} from 'react-native';
import {ButtonProps} from './Button';
import {useImmer} from 'use-immer';
import {useTheme} from 'styled-components/native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {ElevationProps} from '../Elevation/Elevation';

export type State = 'enabled' | 'hovered' | 'focused' | 'pressed' | 'disabled';
export type ElevationLevel = ElevationProps['level'];

export type RenderProps = ButtonProps &
    Pick<TouchableRippleProps, 'underlayColor'> & {elevationLevel: ElevationLevel};

export interface BaseButtonProps extends ButtonProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export const BaseButton: FC<BaseButtonProps> = ({
    type,
    render,
    onHoverIn,
    onHoverOut,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const [elevationLevel, setElevationLevel] = useImmer<ElevationLevel>(0);
    const processState = (nextState: State): void => {
        if (state !== 'disabled') {
            setState(() => nextState);
        }
    };

    const processElevationLevel = (nextElevationLevel: ElevationLevel): void => {
        if (state !== 'disabled') {
            setElevationLevel(() => nextElevationLevel);
        }
    };

    const handleHoverIn = (event: MouseEvent) => {
        onHoverIn?.(event);
        processState('hovered');
        processElevationLevel(1);
    };

    const handleHoverOut = (event: MouseEvent) => {
        onHoverOut?.(event);
        processState('enabled');
        processElevationLevel(0);
    };

    const container = render({
        ...args,
        id,
        underlayColor: theme.color.rgba(theme.palette.primary.onPrimary, 0.12),
        type,
        elevationLevel,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
    });

    return container;
};
