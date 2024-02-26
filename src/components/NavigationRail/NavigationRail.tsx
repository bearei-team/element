import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container, Destination, Fab} from './NavigationRail.styles';
import {NavigationRailBase, NavigationRailProps, RenderProps} from './NavigationRailBase';

const render = ({id, children, fab, ...containerProps}: RenderProps) => (
    <Container {...containerProps} testID={`navigationRail--${id}`}>
        {fab && <Fab testID={`navigationRail__fab--${id}`}>{fab}</Fab>}
        <Destination testID={`navigationRail__destination--${id}`}>{children}</Destination>
    </Container>
);

const ForwardRefNavigationRail = forwardRef<View, NavigationRailProps>((props, ref) => (
    <NavigationRailBase {...props} ref={ref} render={render} />
));

export const NavigationRail: FC<NavigationRailProps> = memo(ForwardRefNavigationRail);
export type {NavigationRailProps};
