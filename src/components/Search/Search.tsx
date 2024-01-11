import {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    PressableProps,
    TextInput,
    TextInputProps,
    TouchableWithoutFeedbackProps,
} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {List, ListDataSource} from '../List/List';
import {
    Container,
    Content,
    Header,
    Inner,
    LeadingIcon,
    TrailingIcon,
} from './Search.styles';
import {RenderProps, SearchBase} from './SearchBase';

export interface SearchProps
    extends Partial<
        TextInputProps &
            PressableProps &
            TouchableWithoutFeedbackProps &
            RefAttributes<TextInput>
    > {
    data?: ListDataSource[];
    leadingIcon?: React.JSX.Element;
    trailingIcon?: React.JSX.Element;
}

const AnimatedInner = Animated.createAnimatedComponent(Inner);
const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            children,
            containerRef,
            data,
            eventName,
            id,
            leadingIcon,
            listVisible,
            onEvent,
            onListActive,
            placeholder,
            renderStyle,
            trailingIcon,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {onLayout, ...onHeaderEvent} = onEvent;
        const {height, innerHeight, width, listBackgroundColor, pageX, pageY} =
            renderStyle;

        const shape = 'extraLarge';

        return (
            <Container
                {...containerProps}
                testID={`search--${id}`}
                onLayout={onLayout}
                ref={containerRef}>
                <AnimatedInner
                    shape={shape}
                    width={width}
                    style={{height: innerHeight}}
                    testID={`search__inner--${id}`}
                    pageX={pageX}
                    pageY={pageY}>
                    <Header
                        {...onHeaderEvent}
                        accessibilityLabel={placeholder}
                        accessibilityRole="keyboardkey"
                        testID={`search__header--${id}`}>
                        <LeadingIcon testID={`search__leadingIcon--${id}`}>
                            {leadingIcon}
                        </LeadingIcon>

                        <Content testID={`search__content--${id}`}>
                            {children}
                        </Content>

                        <TrailingIcon testID={`search__trailingIcon--${id}`}>
                            {trailingIcon}
                        </TrailingIcon>

                        <Hovered
                            eventName={eventName}
                            height={height}
                            opacities={[0, 0.08]}
                            shape={listVisible ? 'extraLargeTop' : shape}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    </Header>

                    <Divider size="large" width={width} />
                    <List
                        onActive={onListActive}
                        data={data}
                        style={{backgroundColor: listBackgroundColor}}
                    />
                </AnimatedInner>
            </Container>
        );
    };

    return <SearchBase {...props} ref={ref} render={render} />;
});

export const Search: FC<SearchProps> = memo(ForwardRefSearch);
