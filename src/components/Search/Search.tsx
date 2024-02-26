import {FC, forwardRef, memo} from 'react';
import {TextInput} from 'react-native';
import {Inner} from './Inner/Inner';
import {Container} from './Search.styles';
import {RenderProps, SearchBase, SearchProps} from './SearchBase';

const render = ({containerRef, id, onEvent, status, ...innerProps}: RenderProps) => {
    const {onLayout} = onEvent;

    return (
        <Container testID={`search--${id}`} ref={containerRef} onLayout={onLayout}>
            {status === 'succeeded' && <Inner {...innerProps} />}
        </Container>
    );
};

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase {...props} ref={ref} render={render} />
));

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
export type {SearchProps};
