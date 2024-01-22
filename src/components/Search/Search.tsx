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
    trailingIcon?: React.JSX.Element;
}

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {containerRef, id, onEvent, ...containerProps} = renderProps;

        const {onLayout} = onEvent;

        return (
            <Container
                {...containerProps}
                testID={`search--${id}`}
                onLayout={onLayout}
                ref={containerRef}
            />
        );
    };

    return <SearchBase {...props} ref={ref} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
