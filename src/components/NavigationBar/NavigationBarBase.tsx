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
    menus?.map(menu => <Item {...menu} key={menu.key} onPress={() => onActive(menu.key!)} />);

export const NavigationBarBase: FC<NavigationBarBaseProps> = props => {
    const {render, onChange, menus: sourceMenus, ...renderProps} = props;
    const [menus, setMenus] = useImmer<Menu[]>([]);
    const id = useId();

    const handleActive = (key: string) => {
        setMenus(draft => {
            draft.forEach(item => (item.active = item.key === key));
        });

        onChange?.(key);
    };

    useEffect(() => {
        if (sourceMenus) {
            setMenus(() =>
                sourceMenus.map((menu, index) => ({
                    ...menu,
                    active: false,
                    key: menu.key ?? index,
                })),
            );
        }
    }, [setMenus, sourceMenus]);

    return render({
        ...renderProps,
        id,
        children: renderMenus({menus, onActive: handleActive}),
    });
};
