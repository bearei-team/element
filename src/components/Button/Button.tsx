import {FC, ReactNode} from 'react';
import {BaseButton, RenderProps} from './BaseButton';
import {Label, Main} from './Button.styles';
import {PressableProps} from 'react-native';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Elevation} from '../Elevation/Elevation';
import {Shape} from '../Shape/Shape';

export type Type = 'filled' | 'outlined' | 'text' | 'elevated';
export interface ButtonProps extends Omit<PressableProps, 'children'> {
    icon?: React.JSX.Element;
    type?: Type;
    label?: ReactNode;
    disable?: boolean;
    loading?: boolean;
    children?: ReactNode;
}

export const Button: FC<ButtonProps> = props => {
    const render = ({id, elevationLevel, label, ...args}: RenderProps) => {
        const main = (
            <Main testID={`button--${id}`}>
                <Label testID={`button__label--${id}`}>{label}</Label>
            </Main>
        );

        return (
            <Elevation level={elevationLevel} shape="full" role="button">
                <Shape shape="full">
                    <TouchableRipple {...args}>{main}</TouchableRipple>
                </Shape>
            </Elevation>
        );
    };

    return <BaseButton {...props} render={render} />;
};
