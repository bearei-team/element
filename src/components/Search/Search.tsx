import {FC, forwardRef, memo} from 'react'
import {TextInput} from 'react-native'
import {Divider} from '../Divider/Divider'
import {Icon} from '../Icon/Icon'
import {Underlay} from '../Underlay/Underlay'
import {Container, Content, Inner, Leading, Trailing} from './Search.styles'
import {RenderProps, SearchBase, SearchProps} from './SearchBase'

const render = ({
    containerRef,
    eventName,
    iconRenderStyle,
    id,
    input,
    leading,
    listVisible,
    onEvent,
    placeholder,
    searchList,
    trailing,
    type,
    underlayColor,
    ...containerProps
}: RenderProps) => {
    const shape = listVisible ? 'extraLargeTop' : 'extraLarge'

    return (
        <Container
            {...containerProps}
            ref={containerRef}
            shape={shape}
            testID={`search__inner--${id}`}
        >
            <Inner
                {...onEvent}
                accessibilityLabel={placeholder}
                accessibilityRole='keyboardkey'
                testID={`search__inner--${id}`}
                trailingShow={!!trailing}
            >
                <Leading testID={`search__leading--${id}`}>
                    {leading ?? (
                        <Icon
                            name='search'
                            renderStyle={iconRenderStyle}
                            type='outlined'
                        />
                    )}
                </Leading>

                <Content testID={`search__content--${id}`}>{input}</Content>
                {trailing && (
                    <Trailing testID={`search__trailing--${id}`}>
                        {trailing}
                    </Trailing>
                )}

                <Underlay
                    eventName={eventName}
                    opacities={[0, 0.08]}
                    underlayColor={underlayColor}
                />
            </Inner>

            {listVisible && (
                <Divider
                    block={true}
                    size='large'
                />
            )}

            {type === 'standard' && <>{searchList}</>}
        </Container>
    )
}

const ForwardRefSearch = forwardRef<TextInput, SearchProps>((props, ref) => (
    <SearchBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Search: FC<SearchProps> = memo(ForwardRefSearch)
export type {SearchProps}
