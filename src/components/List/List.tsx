import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {ItemProps} from './Item/Item';
import {Container} from './List.styles';
import {ListBase, RenderProps} from './ListBase';

export interface ListSourceMenu extends Pick<ItemProps, 'headline' | 'supportingText' | 'leading'> {
    key?: string;
}

export interface ListProps extends Partial<ViewProps & RefAttributes<View>> {
    menus?: ListSourceMenu[];
    onChange?: (key: string) => void;
    close?: boolean;
}

/**
 * TODO:
 */
const ForwardRefList = forwardRef<View, ListProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`list--${id}`}>
                {children}
            </Container>
        );
    };

    return <ListBase {...props} render={render} />;
});

export const List: FC<ListProps> = memo(ForwardRefList);
