import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Supporting} from './Supporting/Supporting';
import {Container, Content} from './Tooltip.styles';
import {RenderProps, TooltipBase, TooltipProps} from './TooltipBase';

/**
 * TODO: "rich"
 */

const render = ({
    children,
    containerCurrent,
    id,
    onEvent,
    onVisible,
    renderStyle,
    supportingPosition,
    supportingText,
    visible,
    ...containerProps
}: RenderProps) => {
    const {width, height} = renderStyle;
    const {onLayout, ...onContainerEvent} = onEvent;

    return (
        <Container
            {...containerProps}
            {...onContainerEvent}
            testID={`tooltip--${id}`}
            renderStyle={{width, height}}>
            <Content onLayout={onLayout} testID={`tooltip__content--${id}`}>
                {children}
            </Content>

            {typeof visible === 'boolean' && typeof supportingText === 'string' && (
                <Supporting
                    containerCurrent={containerCurrent}
                    onVisible={onVisible!}
                    supportingPosition={supportingPosition}
                    supportingText={supportingText}
                    visible={visible}
                />
            )}
        </Container>
    );
};

const ForwardRefTooltip = forwardRef<View, TooltipProps>((props, ref) => (
    <TooltipBase {...props} ref={ref} render={render} />
));

export const Tooltip: FC<TooltipProps> = memo(ForwardRefTooltip);
export type {TooltipProps};
