import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container, Destination, Fab} from './NavigationRail.styles';
import {NavigationRailBase, RenderProps} from './NavigationRailBase';
import {NavigationRailItemProps} from './NavigationRailItem/NavigationRailItem';

export interface NavigationDataSource extends NavigationRailItemProps {
    key?: string;
}

export interface NavigationRailProps extends Partial<ViewProps & RefAttributes<View>> {
    activeKey?: string;
    block?: boolean;
    data?: NavigationDataSource[];
    defaultActiveKey?: string;
    fab?: React.JSX.Element;
    onActive?: (key?: string) => void;
}

const ForwardRefNavigationRail = forwardRef<View, NavigationRailProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, fab, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} testID={`navigationRail--${id}`}>
                {fab && <Fab testID={`navigationRail__fab--${id}`}>{fab}</Fab>}

                <Destination testID={`navigationRail__destination--${id}`}>{children}</Destination>
            </Container>
        );
    };

    return <NavigationRailBase {...props} ref={ref} render={render} />;
});

export const NavigationRail: FC<NavigationRailProps> = memo(ForwardRefNavigationRail);
