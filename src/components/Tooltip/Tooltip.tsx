import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container} from './Tooltip.styles';
import {RenderProps, TooltipBase} from './TooltipBase';

export type TooltipType = 'plain' | 'rich';
export interface TooltipProps extends TouchableRippleProps {
    supportingPosition?: 'horizontalStart' | 'horizontalEnd' | 'verticalStart' | 'verticalEnd';
    supportingText?: string;
    type?: TooltipType;
    visible?: boolean;
}

/**
 * TODO: "rich"
 */

const render = ({children, id, renderStyle, ...containerProps}: RenderProps) => {
    const {width, height} = renderStyle;

    return (
        <Container {...containerProps} testID={`tooltip--${id}`} width={width} height={height}>
            {children}
        </Container>
    );
};

const ForwardRefTooltip = forwardRef<View, TooltipProps>((props, ref) => (
    <TooltipBase {...props} ref={ref} render={render} />
));

export const Tooltip: FC<TooltipProps> = memo(ForwardRefTooltip);
