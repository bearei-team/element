import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ItemProps} from './Item/Item';
import {Container} from './Navigation.styles';
import {NavigationBarBase, RenderProps} from './NavigationBase';

export interface NavigationSourceMenu extends Pick<ItemProps, 'icon' | 'activeIcon'> {
    key?: string;
    labelText?: string;
}

export interface NavigationBarProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: 'horizontal' | 'vertical';
    menus?: NavigationSourceMenu[];
    onChange?: (key: string) => void;
}

/**
 * TODO:
 */
const ForwardRefNavigationBar = forwardRef<View, NavigationBarProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`navigationBar--${id}`}>
                {children}
            </Container>
        );
    };

    return <NavigationBarBase {...props} render={render} />;
});

export const NavigationBar: FC<NavigationBarProps> = memo(ForwardRefNavigationBar);
