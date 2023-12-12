import {FC, RefAttributes, forwardRef, memo} from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {NativeTarget} from 'styled-components/native';
import {ItemProps} from './Item/Item';
import {Container} from './List.styles';
import {ListBase, RenderProps} from './ListBase';

export interface ListDataSource extends Pick<ItemProps, 'headline' | 'supportingText' | 'leading'> {
    key?: string;
}

export interface ListProps
    extends Partial<FlatListProps<ListDataSource> & RefAttributes<FlatList<ListDataSource>>> {
    data?: ListDataSource[];
    onChange?: (key: string) => void;
    close?: boolean;
}

const ForwardRefList = forwardRef<FlatList<ListDataSource>, ListProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, ...containerProps} = renderProps;

        return (
            <Container<NativeTarget>
                {...containerProps}
                accessibilityLabel="list"
                accessibilityRole="grid"
                ref={ref}
                testID={`list--${id}`}
            />
        );
    };

    return <ListBase {...props} render={render} />;
});

export const List: FC<ListProps> = memo(ForwardRefList);
