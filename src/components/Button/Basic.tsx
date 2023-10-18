import {FC, ReactNode, useEffect, useId, useState} from 'react';
import {GestureResponderEvent} from 'react-native';

export type State = 'enabled' | 'hovered' | 'focused' | 'pressed' | 'disabled';
export type Type = 'filled' | 'outlined' | 'text' | 'elevated';
export interface BasicButtonProps {
    icon?: ReactNode;
    disable?: boolean;
    loading?: boolean;
    label?: ReactNode;
    type?: Type;
    onPress?: (e: GestureResponderEvent) => void;
}

export interface ButtonProps extends BasicButtonProps {
    renderIcon?: (props: ButtonIconProps) => ReactNode;
    renderMain: (props: ButtonMainProps) => ReactNode;
    renderContainer: (props: ButtonContainerProps) => ReactNode;
}

export interface ButtonChildrenProps extends BasicButtonProps {
    id: string;
    state: State;
    showIcon: boolean;
    children?: ReactNode;
    handleState: (state: State) => void;
}

export type ButtonIconProps = ButtonChildrenProps;
export type ButtonMainProps = ButtonChildrenProps;
export type ButtonContainerProps = ButtonChildrenProps;

export const Basic: FC<ButtonProps> = props => {
    const id = useId();
    const [state, setIsState] = useState<State>('enabled');
    const {renderIcon, renderMain, renderContainer, icon, loading, disable, ...args} = props;
    const handleState = (value: State) => {
        if (state !== 'disabled') {
            setIsState(value);
        }
    };

    const childrenProps = {...args, id, loading, state, showIcon: !!icon, handleState};
    const iconNode = icon && renderIcon?.({...childrenProps, children: icon});
    const main = renderMain({...childrenProps});
    const container = renderContainer({
        ...childrenProps,
        children: (
            <>
                {iconNode}
                {main}
            </>
        ),
    });

    useEffect(() => {
        if (typeof disable === 'boolean') {
            setIsState(disable ? 'disabled' : 'enabled');
        }
    }, [disable]);

    return container;
};
