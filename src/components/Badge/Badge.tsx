import {FC, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container, Label} from './Badge.styles';
import {BaseBadge, RenderProps} from './BaseBadge';
import {Size} from '../common/interface';

export interface BadgeProps extends ViewProps {
    label?: number | string;
    size?: Size;
}

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => {
    const render = ({id, label, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} testID={`badge--${id}`} shape="full">
            <Label testID={`badge__label--${id}`}>{label}</Label>
        </Container>
    );

    return <BaseBadge {...props} render={render} />;
});

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
