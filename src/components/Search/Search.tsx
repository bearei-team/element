import {FC, forwardRef, memo} from 'react';
import {TextInput} from 'react-native';
import {Divider} from '../Divider/Divider';
import {Hovered} from '../Hovered/Hovered';
import {Icon} from '../Icon/Icon';
import {Container, Content, Inner, Leading, Trailing} from './Search.styles';
import {RenderProps, SearchBase, SearchProps} from './SearchBase';

const render = ({
    layout,
    eventName,
    id,
    input,
    leading,
    listVisible,
    onEvent,
    placeholder,
    trailing,
    underlayColor,
    containerRef,
    iconRenderStyle,
    ...containerProps
}: RenderProps) => {
    const shape = listVisible ? 'extraLargeTop' : 'extraLarge';
    const {onBlur, onFocus, ...headerEvent} = onEvent;
    const {height, width} = layout;

    return (
        <Container
            {...containerProps}
            ref={containerRef}
            shape={shape}
            testID={`search__inner--${id}`}>
            <Inner
                {...headerEvent}
                accessibilityLabel={placeholder}
                accessibilityRole="keyboardkey"
                onBlur={onBlur}
                onFocus={onFocus}
                testID={`search__inner--${id}`}
                trailingShow={!!trailing}>
                <Leading testID={`search__leading--${id}`}>
                    {leading ?? (
                        <Icon type="outlined" name="search" renderStyle={iconRenderStyle} />
                    )}
                </Leading>

                <Content testID={`search__content--${id}`}>{input}</Content>
                {trailing && <Trailing testID={`search__trailing--${id}`}>{trailing}</Trailing>}

                <Hovered
                    eventName={eventName}
                    opacities={[0, 0.08]}
                    renderStyle={{width, height}}
                    shape={listVisible ? 'extraLargeTop' : shape}
                    underlayColor={underlayColor}
                />
            </Inner>

            {listVisible && <Divider size="large" block={true} />}
        </Container>
    );
};

const ForwardRefInner = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase {...props} ref={ref} render={render} />
));

export const Search: FC<SearchProps> = memo(ForwardRefInner);
export type {SearchProps};
