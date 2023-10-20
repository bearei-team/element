import {FC, ReactNode} from 'react';
import {BaseButton, RenderContainerProps, RenderIconProps, RenderMainProps} from './BaseButton';
import {Container, Icon, Label, Main} from './Button.styles';
import {PressableProps} from 'react-native';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';

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
    const renderContainer = ({id, children, ...args}: RenderContainerProps) => (
        <Container testID={`button__container--${id}`} role="button">
            <TouchableRipple {...args}>{children} </TouchableRipple>
        </Container>
    );

    const renderMain = ({id, label}: RenderMainProps) => (
        <Main testID={`button__main--${id}`}>
            <Label testID={`button__label--${id}`}>{label}</Label>
        </Main>
    );

    const renderIcon = ({id}: RenderIconProps) => <Icon testID={`button__icon--${id}`}></Icon>;

    return (
        <BaseButton
            {...props}
            renderContainer={renderContainer}
            renderMain={renderMain}
            renderIcon={renderIcon}
        />
    );
};
