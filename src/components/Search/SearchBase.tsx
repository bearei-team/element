import {FC, useId} from 'react';
import {Animated, ViewStyle} from 'react-native';
import {Icon} from '../Icon/Icon';
import {SearchProps, SourceMenu} from './Search';
import {useAnimated} from './useAnimated';

export interface RenderProps extends SearchProps {
    renderStyle: Animated.WithAnimatedObject<ViewStyle> & {};
}
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
    const {render, trailingIcon, ...renderProps} = props;
    const {height} = useAnimated({});
    const id = useId();

    return render({
        ...renderProps,
        id,
        renderStyle: {
            height,
        },
        trailingIcon: trailingIcon ?? <Icon></Icon>,
    });
};
