import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ItemProps} from './Item/Item';
import {Container, Destination, Fab} from './Navigation.styles';
import {NavigationBase, RenderProps} from './NavigationBase';

export interface NavigationDataSource extends ItemProps {
    key?: string;
}

export type NavigationType = 'bar' | 'drawer' | 'rail';
export interface NavigationProps extends Partial<ViewProps & RefAttributes<View>> {
    data?: NavigationDataSource[];
    onChange?: (key: string) => void;
    type?: NavigationType;

    /**
     * Setting the navigation item style determines whether to consistently display the labelText.
     * This only takes effect in navigation types 'bar' and 'rail'.
     */
    block?: boolean;
    fab?: React.JSX.Element;
}

/**
 * TODO: "drawer"
 */
const ForwardRefNavigation = forwardRef<View, NavigationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, type, fab, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} type={type} testID={`navigation--${id}`}>
                {fab && <Fab>{fab}</Fab>}
                <Destination type={type} testID={`navigation__destination--${id}`}>
                    {children}
                </Destination>
            </Container>
        );
    };

    return <NavigationBase {...props} render={render} />;
});

export const Navigation: FC<NavigationProps> = memo(ForwardRefNavigation);
