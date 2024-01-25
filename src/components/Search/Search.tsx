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
    leadingIcon?: React.JSX.Element;
    onActive?: (key?: string) => void;
    trailingIcon?: React.JSX.Element;
}

const render = ({containerRef, id, onEvent, ...containerProps}: RenderProps) => (
    <Container {...containerProps} {...onEvent} testID={`search--${id}`} ref={containerRef} />
);

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase {...props} ref={ref} render={render} />
));

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
