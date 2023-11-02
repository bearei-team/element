import {FC, memo} from 'react';
import {ViewProps} from 'react-native';
import {Container, Label} from './Badge.styles';
import {BaseBadge, RenderProps} from './BaseBadge';
import {Size} from '../common/interface';

export interface BadgeProps extends ViewProps {
    label?: number | string;
    size: Size;
}

export const Badge: FC<BadgeProps> = memo(props => {
    const render = ({id, label, ...containerProps}: RenderProps) => {
        return (
            <Container {...containerProps} testID={`badge--${id}`} shape="full">
                <Label testID={`badge__main--${id}`}>{label}</Label>
            </Container>
        );
    };

    return <BaseBadge {...props} render={render} />;
});
