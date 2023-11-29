import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';
import {Container, ContentText} from './Badge.styles';
import {BadgeBase, RenderProps} from './BadgeBase';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    contentText?: number | string;
    size?: Size;
}

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => {
    const render = ({id, contentText, ...containerProps}: RenderProps) => (
        <Container {...containerProps} ref={ref} shape="full" testID={`badge--${id}`}>
            <ContentText testID={`badge__label--${id}`}>{contentText}</ContentText>
        </Container>
    );

    return <BadgeBase {...props} render={render} />;
});

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
