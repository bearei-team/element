import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container} from './NavigationBar.styles';
import {NavigationBarBase, RenderProps} from './NavigationBarBase';

export interface SourceMenu {
    icon: React.JSX.Element;
    key?: string;
    label?: string;
}

export interface NavigationBarProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: 'horizontal' | 'vertical';
    menus?: SourceMenu[];
    onChange?: (key: string) => void;
}

const ForwardRefNavigationBar = forwardRef<View, NavigationBarProps>((props, ref) => {
    const render = ({id, children, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`navigationBar--${id}`}>
            {children}
        </Container>
    );

    return <NavigationBarBase {...props} render={render} />;
});

export const NavigationBar: FC<NavigationBarProps> = memo(ForwardRefNavigationBar);
