import {FC, RefAttributes, forwardRef, memo} from 'react';
import {View, ViewProps} from 'react-native';
import {Container} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SourceMenu {
    key?: string;
    labelText?: string;
}

export interface SearchProps extends Partial<ViewProps & RefAttributes<View>> {
    layout?: 'horizontal' | 'vertical';
    menus?: SourceMenu[];
    onChange?: (key: string) => void;
}

const ForwardRefSearch = forwardRef<View, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, ...containerProps} = renderProps;

        return (
            <Container {...containerProps} ref={ref} testID={`search--${id}`}>
                {children}
            </Container>
        );
    };

    return <SearchBase {...props} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
