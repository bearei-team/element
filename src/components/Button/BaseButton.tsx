import {FC, useId} from 'react';
import {MouseEvent, ViewProps} from 'react-native';
import {ButtonProps} from './Button';
import {useImmer} from 'use-immer';
import {useTheme} from 'styled-components/native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';

export type State = 'enabled' | 'hovered' | 'focused' | 'pressed' | 'disabled';
export type RenderIconProps = ViewProps;
export type RenderMainProps = ViewProps & Pick<ButtonProps, 'label' | 'type'>;
export type RenderContainerProps = Omit<ButtonProps, 'icon' | 'label'> &
    Pick<TouchableRippleProps, 'underlayColor'>;

export interface BaseButtonProps extends ButtonProps {
    renderIcon: (props: RenderIconProps) => React.JSX.Element;
    renderMain: (props: RenderMainProps) => React.JSX.Element;
    renderContainer: (props: RenderContainerProps) => React.JSX.Element;
}

export const BaseButton: FC<BaseButtonProps> = ({
    type,
    label,
    renderMain,
    renderContainer,
    onHoverIn,
    onHoverOut,
    ...args
}): React.JSX.Element => {
    const id = useId();
    const theme = useTheme();
    const [state, setState] = useImmer<State>('enabled');
    const processState = (nextState: State) => {
        if (state !== 'disabled') {
            setState(() => nextState);
        }
    };

    const handleHoverIn = (event: MouseEvent) => {
        onHoverIn?.(event);
        processState('hovered');
    };

    const handleHoverOut = (event: MouseEvent) => {
        onHoverOut?.(event);
        processState('enabled');
    };

    const main = renderMain({
        id,
        type,
        label,
    });

    const container = renderContainer({
        ...args,
        id,
        children: main,
        underlayColor: theme.color.rgba(theme.palette.primary.onPrimary, 0.12),
        type,
        onHoverIn: handleHoverIn,
        onHoverOut: handleHoverOut,
    });

    return container;
};
