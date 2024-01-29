import {FC, RefAttributes, forwardRef, memo} from 'react';
import {FlatList, FlatListProps} from 'react-native';
import {NativeTarget} from 'styled-components/native';
import {ShapeProps} from '../Common/Common.styles';
import {Container, Content} from './List.styles';
import {ListBase, RenderProps} from './ListBase';
import {ListItemProps} from './ListItem/ListItem';

export interface ListDataSource
    extends Pick<
        ListItemProps,
        'headline' | 'leading' | 'supportingText' | 'supportingTextNumberOfLines' | 'trailing'
    > {
    key?: string;
}

export interface ListProps
    extends Partial<FlatListProps<ListDataSource> & RefAttributes<FlatList<ListDataSource>>> {
    activeKey?: string;

    /**
     * Sets whether the item can be closed.
     */
    close?: boolean;
    data?: ListDataSource[];
    defaultActiveKey?: string;

    /**
     * Set the shape of the item.
     */
    shape?: ShapeProps['shape'];

    /**
     * Specifies the spacing between items
     */
    gap?: number;
    onActive?: (key?: string) => void;
    onClose?: (key?: string) => void;
    supportingTextNumberOfLines?: ListDataSource['supportingTextNumberOfLines'];
}

const render = ({id, style, ...contentProps}: RenderProps) => (
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

const ForwardRefList = forwardRef<FlatList<ListDataSource>, ListProps>((props, ref) => (
    <ListBase {...props} ref={ref} render={render} />
));

export const List: FC<ListProps> = memo(ForwardRefList);
