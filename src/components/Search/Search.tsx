import {FC, forwardRef, memo} from 'react';
import {TextInput} from 'react-native';
import {Container} from './Search.styles';
import {RenderProps, SearchBase, SearchProps} from './SearchBase';
import {TextField} from './TextField/TextField';

const render = ({containerRef, id, onEvent, status, ...textFieldProps}: RenderProps) => {
    const {onLayout} = onEvent;

    return (
        <Container testID={`search--${id}`} ref={containerRef} onLayout={onLayout}>
            {status === 'succeeded' && <TextField {...textFieldProps} />}
        </Container>
    );
};

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase {...props} ref={ref} render={render} />
));

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
export type {SearchProps};
