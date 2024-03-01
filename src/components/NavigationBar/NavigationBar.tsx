import React, {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Container, Destination} from './NavigationBar.styles';
import {
    NavigationBarBase,
    NavigationBarProps,
    NavigationDataSource,
    RenderProps,
} from './NavigationBarBase';

const render = ({
    id,
    children,
    renderStyle,
    block,
    onEvent,
    onDestinationLayout,
    ...containerProps
}: RenderProps) => {
    const {width, destinationWidth} = renderStyle;
    const {onLayout} = onEvent;

    return (
        <Container
            {...containerProps}
            testID={`NavigationBar--${id}`}
            block={block}
            renderStyle={{width: destinationWidth}}
            onLayout={onLayout}>
            <Destination
                testID={`NavigationBar__destination--${id}`}
                block={block}
                renderStyle={{width}}
                onLayout={onDestinationLayout}>
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
