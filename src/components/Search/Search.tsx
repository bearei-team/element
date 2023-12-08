import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    Pressable,
    PressableProps,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedback,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {Container, Content, Header, Inner, LeadingIcon, TrailingIcon} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SourceMenu {
    key?: string;
    labelText?: string;
}

export interface SearchProps
    extends Partial<
        TextInputProps & PressableProps & TouchableWithoutFeedbackProps & RefAttributes<TextInput>
    > {
    leadingIcon?: React.JSX.Element;
    menus?: SourceMenu[];
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
            renderStyle,
            state,
            trailingIcon,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {innerHeight, width, height} = renderStyle;

        return (
            <TouchableWithoutFeedback
                {...(containerProps as TouchableWithoutFeedbackProps)}
                onLayout={onLayout}
                testID={`search--${id}`}>
                <Container testID={`search__container--${id}`}>
                    {typeof width === 'number' && (
                        <AnimatedInner
                            style={{height: innerHeight}}
                            shape="extraLarge"
                            width={width}
                            testID={`search__inner--${id}`}>
                            <Pressable
                                onHoverIn={onHoverIn}
                                onHoverOut={onHoverOut}
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
                                        shape={'extraLarge'}
                                        state={state}
                                        underlayColor={underlayColor}
                                        width={width}
                                        opacities={[0.08, 0]}
                                    />
                                </Header>
                            </Pressable>

                            {<Divider size="large" width={width} />}
                        </AnimatedInner>
                    )}
                </Container>
            </TouchableWithoutFeedback>
        );
    };

    return <SearchBase {...props} render={render} ref={ref} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
