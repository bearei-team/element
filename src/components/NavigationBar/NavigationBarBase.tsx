import {FC, useEffect, useId} from 'react';
import {useImmer} from 'use-immer';
import {Item} from './Item/Item';
import {NavigationBarProps, SourceMenu} from './NavigationBar';

export type RenderProps = NavigationBarProps;
export interface NavigationBarBaseProps extends NavigationBarProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderRipplesOptions extends Pick<NavigationBarProps, 'menus'> {
    onActive: (key: string) => void;
}

export interface Menu extends SourceMenu {
    active: boolean;
}

const renderMenus = ({menus, onActive}: RenderRipplesOptions) =>
    menus?.map((menu, index) => (
        <Item
            {...menu}
            key={menu.label ?? index}
            onPress={() => onActive(menu.key ?? `${index}`)}
        />
    ));

export const NavigationBarBase: FC<NavigationBarBaseProps> = ({
    render,
    onChange,
    menus: sourceMenus,
    ...renderProps
}) => {
    const id = useId();
    const [menus, setMenus] = useImmer<Menu[]>([]);
    const handleActive = (key: string) => {
        setMenus(draft => {
            draft.forEach(item => (item.active = item.key === key));
        });

        onChange?.(key);
    };

    useEffect(() => {
        if (sourceMenus) {
            setMenus(() => sourceMenus.map(menu => ({...menu, active: false})));
        }
    }, [setMenus, sourceMenus]);

    console.info(menus);

    return render({
        ...renderProps,
        id,
        children: renderMenus({menus, onActive: handleActive}),
    });
};
