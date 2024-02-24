import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Supporting} from './Supporting/Supporting';
import {Container} from './Tooltip.styles';
import {RenderProps, TooltipBase} from './TooltipBase';

export type TooltipType = 'plain' | 'rich';
export interface TooltipProps extends TouchableRippleProps {
    supportingPosition?: 'horizontalStart' | 'horizontalEnd' | 'verticalStart' | 'verticalEnd';
    supportingText?: string;
    type?: TooltipType;
    visible?: boolean;
    defaultVisible?: boolean;
}

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
    windowDimensions,
    defaultVisible,
    ...containerProps
}: RenderProps) => {
    const {width, height} = renderStyle;

    return (
        <Container
            {...containerProps}
            {...onEvent}
            testID={`tooltip--${id}`}
            renderStyle={{width, height}}>
            {children}
            {typeof width === 'number' && width && (
                <Supporting
                    containerCurrent={containerCurrent}
                    defaultVisible={defaultVisible}
                    onVisible={onVisible}
                    supportingPosition={supportingPosition}
                    supportingText={supportingText}
                    visible={visible}
                    windowDimensions={windowDimensions}
                />
            )}
        </Container>
    );
};

const ForwardRefTooltip = forwardRef<View, TooltipProps>((props, ref) => (
    <TooltipBase {...props} ref={ref} render={render} />
));

export const Tooltip: FC<TooltipProps> = memo(ForwardRefTooltip);
