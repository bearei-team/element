import {FC, useId} from 'react';
import {SearchProps, SourceMenu} from './Search';

export type RenderProps = SearchProps;
export interface SearchBaseProps extends SearchProps {
    render: (props: RenderProps) => React.JSX.Element;
}

export interface RenderRipplesOptions extends Pick<SearchProps, 'menus'> {
    onActive: (key: string) => void;
}

export interface Menu extends SourceMenu {
    active: boolean;
}

// const renderMenus = (options: RenderRipplesOptions) => {
//     const {menus, onActive} = options;

//     return menus?.map(menu => (
//         <Item {...menu} key={menu.key} onPress={() => onActive(menu.key!)} />
//     ));
// };

export const SearchBase: FC<SearchBaseProps> = props => {
    const {render, ...renderProps} = props;
    // const [menus, setMenus] = useImmer<Menu[]>([]);
    const id = useId();

    // const handleActive = (key: string) => {
    //     setMenus(draft => {
    //         draft.forEach(item => (item.active = item.key === key));
    //     });

    //     onChange?.(key);
    // };

    // useEffect(() => {
    //     sourceMenus &&
    //         setMenus(() =>
    //             sourceMenus.map((menu, index) => ({
    //                 ...menu,
    //                 active: false,
    //                 key: menu.key ?? index,
    //             })),
    //         );
    // }, [setMenus, sourceMenus]);

    return render({
        ...renderProps,
        id,
        // children: renderMenus({menus, onActive: handleActive}),
    });
};
