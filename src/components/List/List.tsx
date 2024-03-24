import {FC, forwardRef, memo} from 'react'
import {FlatList} from 'react-native'
import {NativeTarget} from 'styled-components/native'
import {Container, Content} from './List.styles'
import {ListBase, ListDataSource, ListProps, RenderProps} from './ListBase'

const render = ({id, style, ...contentProps}: RenderProps) => (
    <Container
        accessibilityLabel='list'
        accessibilityRole='list'
        style={style}
        testID={`list--${id}`}
    >
        <Content<NativeTarget>
            {...contentProps}
            showsVerticalScrollIndicator={false}
            testID={`list__content--${id}`}
        />
    </Container>
)

const ForwardRefList = forwardRef<FlatList<ListDataSource>, ListProps>(
    (props, ref) => (
        <ListBase
            {...props}
            ref={ref}
            render={render}
        />
    )
)

export const List: FC<ListProps> = memo(ForwardRefList)
export type {ListDataSource, ListProps}
