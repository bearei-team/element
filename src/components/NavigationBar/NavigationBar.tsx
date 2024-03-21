import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container, Destination} from './NavigationBar.styles';
import {
    NavigationBarBase,
    NavigationBarProps,
    NavigationDataSource,
    RenderProps,
} from './NavigationBarBase';

const render = ({id, children, block, ...containerProps}: RenderProps) => {
    return (
        <Container {...containerProps} testID={`NavigationBar--${id}`} block={block}>
            <Destination testID={`NavigationBar__destination--${id}`} block={block}>
                {children}
            </Destination>
        </Container>
    );
};

const ForwardRefNavigationBar = forwardRef<View, NavigationBarProps>((props, ref) => (
    <NavigationBarBase {...props} ref={ref} render={render} />
));

export const NavigationBar: FC<NavigationBarProps> = memo(ForwardRefNavigationBar);
export type {NavigationBarProps, NavigationDataSource};
