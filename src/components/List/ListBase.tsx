import {FC, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {Item} from './Item/Item';
import {ListProps, SourceMenu} from './List';

export type RenderProps = ListProps;
export interface ListBaseProps extends ListProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderMenusOptions extends Pick<ListProps, 'menus'> {
    onActive: (key: string) => void;
}

export interface Menu extends SourceMenu {
    active: boolean;
}

const renderMenus = (options: RenderMenusOptions) => {
    const {menus, onActive} = options;

    return menus?.map(menu => (
        <Item {...menu} key={menu.key} onPress={() => onActive(menu.key!)} />
    ));
};

export const ListBase: FC<ListBaseProps> = props => {
    const {render, menus: sourceMenus, onChange, ...renderProps} = props;
    const id = useId();
    const [menus, setMenus] = useImmer<Menu[]>([]);

    const handleActive = (key: string) => {
        setMenus(draft => {
            draft.forEach(item => (item.active = item.key === key));
        });

        onChange?.(key);
    };

    useEffect(() => {
        sourceMenus &&
            setMenus(() =>
                sourceMenus.map((menu, index) => ({
                    ...menu,
                    active: false,
                    key: menu.key ?? index,
                })),
            );
    }, [setMenus, sourceMenus]);

    return render({
        ...renderProps,
        id,
        children: renderMenus({menus, onActive: handleActive}),
    });
};
