import {FC, ReactNode} from 'react';
import {BaseButton, RenderProps} from './BaseButton';
import {Icon, Label, Main} from './Button.styles';
import {PressableProps} from 'react-native';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';

export type Type = 'filled' | 'outlined' | 'text' | 'elevated';
export interface ButtonProps extends Omit<PressableProps, 'children'> {
    icon?: React.JSX.Element;
    type?: Type;
    label?: ReactNode;
    disabled?: boolean;
    loading?: boolean;
    children?: ReactNode;
}

export const Button: FC<ButtonProps> = props => {
    const render = ({
        id,
        label,
        state,
        icon,
        type,
        touchableRippleProps,
        showIcon,
    }: RenderProps) => {
        const main = (
            <Main testID={`button--${id}`} state={state} type={type} showIcon={showIcon}>
                {showIcon && <Icon testID={`button__icon--${id}`}>{icon}</Icon>}
                <Label testID={`button__label--${id}`} state={state} type={type}>
                    {label}
                </Label>
            </Main>
        );

        return (
            <TouchableRipple {...touchableRippleProps} shapeProps={{shape: 'full'}}>
                {main}
            </TouchableRipple>
        );
    };

    return <BaseButton {...props} render={render} />;
};
