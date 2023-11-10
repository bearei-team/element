import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../common/interface';
import {Container, Label} from './Badge.styles';
import {BaseBadge, RenderProps} from './BaseBadge';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    label?: number | string;
    size?: Size;
}

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => {
    const render = ({id, label, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} shape="full" testID={`badge--${id}`}>
            <Label testID={`badge__label--${id}`}>{label}</Label>
        </Container>
    );

    return <BaseBadge {...props} render={render} />;
});

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
