import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    PressableProps,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {ListDataSource} from '../List/List';
import {Container} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SearchProps
    extends Partial<
        TextInputProps & PressableProps & TouchableWithoutFeedbackProps & RefAttributes<TextInput>
    > {
    data?: ListDataSource[];
    leading?: React.JSX.Element;
    onActive?: (key?: string) => void;
    trailing?: React.JSX.Element;
    visible?: boolean;
}

const render = ({containerRef, id, ...containerProps}: RenderProps) => (
    <Container {...containerProps} testID={`search--${id}`} ref={containerRef} />
);

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase {...props} ref={ref} render={render} />
));

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
