import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Size} from '../Common/interface';
import {Container, LabelText} from './List.styles';
import {ListBase, RenderProps} from './ListBase';

export interface ListProps extends Partial<ViewProps & RefAttributes<View>> {
    labelText?: number | string;
    size?: Size;
}

const ForwardRefList = forwardRef<View, ListProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, labelText, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} shape="full" testID={`badge--${id}`}>
                <LabelText testID={`badge__labelText--${id}`}>{labelText}</LabelText>
            </Container>
        );
    };

    return <ListBase {...props} render={render} />;
});

export const List: FC<ListProps> = memo(ForwardRefList);
