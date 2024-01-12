import {FC, RefAttributes, forwardRef, memo} from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {NativeTarget} from 'styled-components/native';
import {Container, Content} from './List.styles';
import {ListBase, RenderProps} from './ListBase';
import {ListItemProps} from './ListItem/ListItem';

export interface ListDataSource
    extends Pick<
        ListItemProps,
        'headline' | 'leading' | 'supportingText' | 'supportingTextNumberOfLines'
    > {
    key?: string;
}

export interface ListProps
    extends Partial<FlatListProps<ListDataSource> & RefAttributes<FlatList<ListDataSource>>> {
    close?: boolean;
    data?: ListDataSource[];
    defaultActiveKey?: string;
    onActive?: (key?: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
}

const ForwardRefList = forwardRef<FlatList<ListDataSource>, ListProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, style, ...contentProps} = renderProps;

        return (
            <Container
                accessibilityLabel="list"
                accessibilityRole="list"
                style={style}
                testID={`list--${id}`}>
                <Content<NativeTarget>
                    {...contentProps}
                    showsVerticalScrollIndicator={false}
                    testID={`list__content--${id}`}
                />
            </Container>
        );
    };

    return <ListBase {...props} ref={ref} render={render} />;
});

export const List: FC<ListProps> = memo(ForwardRefList);
