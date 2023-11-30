import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';
import {Container, LabelText} from './Badge.styles';
import {BadgeBase, RenderProps} from './BadgeBase';

export interface BadgeProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: number | string;
    size?: Size;
}

const ForwardRefBadge = forwardRef<View, BadgeProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, labelText, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} shape="full" testID={`badge--${id}`}>
                <LabelText testID={`badge__labelText--${id}`}>{labelText}</LabelText>
            </Container>
        );
    };

    return <BadgeBase {...props} render={render} />;
});

export const Badge: FC<BadgeProps> = memo(ForwardRefBadge);
