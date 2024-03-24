import styled, {css} from 'styled-components/native'
import {Shape, ShapeProps} from '../Common/Common.styles'
import {RenderProps} from './NavigationBarBase'

type ContainerProps = Pick<RenderProps, 'block'> & ShapeProps

type DestinationProps = Pick<ContainerProps, 'block'>

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainer};
    `}

    ${({block}) =>
        block &&
        css`
            width: 100%;
        `}
`

export const Destination = styled.View<DestinationProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
        padding: ${theme.spacing.none}px
            ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({block}) =>
        block &&
        css`
            flex: 1;
        `}
`
