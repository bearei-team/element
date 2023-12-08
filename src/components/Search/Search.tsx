import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    TextInputProps,
    TouchableWithoutFeedback,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Container, Content, Header, Inner, LeadingIcon, TrailingIcon} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SourceMenu {
    key?: string;
    labelText?: string;
}

export interface SearchProps
    extends Partial<
        TextInputProps & TouchableWithoutFeedbackProps & RefAttributes<TouchableWithoutFeedback>
    > {
    leadingIcon?: React.JSX.Element;
    menus?: SourceMenu[];
    trailingIcon?: React.JSX.Element;
}

const AnimatedInner = Animated.createAnimatedComponent(Inner);
const ForwardRefSearch = forwardRef<TouchableWithoutFeedback, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {id, children, renderStyle, leadingIcon, trailingIcon, onLayout, ...containerProps} =
            renderProps;

        const {innerHeight, width} = renderStyle;

        return (
            <TouchableWithoutFeedback
                {...containerProps}
                onLayout={onLayout}
                ref={ref}
                testID={`search--${id}`}>
                <Container testID={`search__container--${id}`}>
                    {typeof width === 'number' && (
                        <AnimatedInner
                            style={{height: innerHeight}}
                            shape="extraLarge"
                            width={width}
                            testID={`search__inner--${id}`}>
                            <Header testID={`search__header--${id}`} width={width}>
                                <LeadingIcon testID={`search__leadingIcon--${id}`}>
                                    {leadingIcon}
                                </LeadingIcon>

                                <Content testID={`search__content--${id}`}>{children}</Content>
                                <TrailingIcon testID={`search__trailingIcon--${id}`}>
                                    {trailingIcon}
                                </TrailingIcon>
                            </Header>

                            {<Divider size="large" width={width} />}
                        </AnimatedInner>
                    )}
                </Container>
            </TouchableWithoutFeedback>
        );
    };

    return <SearchBase {...props} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
