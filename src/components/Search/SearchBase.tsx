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

export const SearchBase: FC<SearchBaseProps> = props => {
    const {render, ...renderProps} = props;
    const id = useId();

    return render({
        ...renderProps,
        id,
    });
};
