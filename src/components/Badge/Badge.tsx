import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';
import {Container, LabelText} from './Badge.styles';
import {BadgeBase, RenderProps} from './BadgeBase';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: number | string;
    size?: Size;
}

const render = ({id, labelText, size, ...containerProps}: RenderProps) => (
    <Container {...containerProps} shape="full" size={size} testID={`badge--${id}`}>
        {size !== 'small' && (
            <LabelText size="small" testID={`badge__labelText--${id}`} type="label">
                {labelText}
            </LabelText>
        )}
    </Container>
);

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => (
    <BadgeBase {...props} ref={ref} render={render} />
));

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
