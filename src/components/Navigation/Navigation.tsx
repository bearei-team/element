import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ItemProps} from './Item/Item';
import {Container} from './Navigation.styles';
import {NavigationBase, RenderProps} from './NavigationBase';

export interface NavigationDataSource extends ItemProps {
    key?: string;
}

export type NavigationType = 'bar' | 'drawer' | 'rail';
export interface NavigationProps extends Partial<ViewProps & RefAttributes<View>> {
    data?: NavigationDataSource[];
    onChange?: (key: string) => void;
    type?: NavigationType;
    block?: boolean;
}

/**
 * TODO: "drawer" | "rail"
 */
const ForwardRefNavigation = forwardRef<View, NavigationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`navigation--${id}`}>
                {children}
            </Container>
        );
    };

    return <NavigationBase {...props} render={render} />;
});

export const Navigation: FC<NavigationProps> = memo(ForwardRefNavigation);
