import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container, Destination, Fab} from './Navigation.styles';
import {NavigationBase, RenderProps} from './NavigationBase';
import {NavigationItemProps} from './NavigationItem/NavigationItem';

export interface NavigationDataSource extends NavigationItemProps {
    key?: string;
}

export type NavigationType = 'bar' | 'drawer' | 'rail';
export interface NavigationProps
    extends Partial<ViewProps & RefAttributes<View>> {
    activeKey?: string;
    block?: boolean;
    data?: NavigationDataSource[];
    defaultActiveKey?: string;
    fab?: React.JSX.Element;
    onChange?: (key: string) => void;
    type?: NavigationType;
}

/**
 * TODO: "drawer" | "bar"
 */
const ForwardRefNavigation = forwardRef<View, NavigationProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, type, fab, ...containerProps} = renderProps;

        return (
            <Container
                {...containerProps}
                ref={ref}
                type={type}
                testID={`navigation--${id}`}>
                {fab && <Fab testID={`navigation__fab--${id}`}>{fab}</Fab>}
                <Destination
                    type={type}
                    testID={`navigation__destination--${id}`}>
                    {children}
                </Destination>
            </Container>
        );
    };

    return <NavigationBase {...props} render={render} />;
});

export const Navigation: FC<NavigationProps> = memo(ForwardRefNavigation);
