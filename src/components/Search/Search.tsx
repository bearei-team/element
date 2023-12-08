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
            shape,
            state,
            trailingIcon,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {height, innerHeight, width} = renderStyle;

        return (
            <TouchableWithoutFeedback
                {...(containerProps as TouchableWithoutFeedbackProps)}
                onLayout={onLayout}
                testID={`search--${id}`}>
                <Container testID={`search__container--${id}`}>
                    {typeof width === 'number' && (
                        <AnimatedInner
                            shape={shape}
                            style={{height: innerHeight}}
                            testID={`search__inner--${id}`}
                            width={width}>
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
                                        opacities={[0.08, 0]}
                                        shape={shape}
                                        state={state}
                                        underlayColor={underlayColor}
                                        width={width}
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
