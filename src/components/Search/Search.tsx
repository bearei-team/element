import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    Pressable,
    PressableProps,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {List, ListDataSource} from '../List/List';
import {Container, Content, Header, Inner, LeadingIcon, TrailingIcon} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SearchProps
    extends Partial<
        TextInputProps & PressableProps & TouchableWithoutFeedbackProps & RefAttributes<TextInput>
    > {
    leadingIcon?: React.JSX.Element;
    data?: ListDataSource[];
    trailingIcon?: React.JSX.Element;
}

const AnimatedInner = Animated.createAnimatedComponent(Inner);
const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            children,
            id,
            leadingIcon,
            onHoverIn,
            onHoverOut,
            onLayout,
            onBlur,
            onFocus,
            renderStyle,
            shape,
            state,
            trailingIcon,
            underlayColor,
            data,
            ...containerProps
        } = renderProps;

        const {height, innerHeight, width} = renderStyle;

        return (
            <Container testID={`search--${id}`} onLayout={onLayout}>
                {typeof width === 'number' && (
                    <AnimatedInner
                        shape={shape}
                        style={{height: innerHeight}}
                        testID={`search__inner--${id}`}
                        width={width}>
                        <Pressable
                            onHoverIn={onHoverIn}
                            onHoverOut={onHoverOut}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            testID={`search__pressable--${id}`}>
                            <Header testID={`search__header--${id}`} width={width}>
                                <LeadingIcon testID={`search__leadingIcon--${id}`}>
                                    {leadingIcon}
                                </LeadingIcon>

                                <Content testID={`search__content--${id}`}>{children}</Content>

                                <TrailingIcon testID={`search__trailingIcon--${id}`}>
                                    {trailingIcon}
                                </TrailingIcon>

                                <Hovered
                                    height={height}
                                    opacities={[0.08, 0]}
                                    shape={shape}
                                    state={state}
                                    underlayColor={underlayColor}
                                    width={width}
                                />
                            </Header>
                        </Pressable>

                        <Divider size="large" width={width} />
                        <List data={data} />
                    </AnimatedInner>
                )}
            </Container>
        );
    };

    return <SearchBase {...props} render={render} ref={ref} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
