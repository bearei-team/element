import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../../Common/Common.styles';
import {RenderProps} from './ListItemBase';

type ContainerProps = Pick<RenderProps, 'gap'>;
interface ContentProps {
    supportingTextShow?: boolean;
}

export const Container = styled(Shape)<ContainerProps>`
    overflow: hidden;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};

    ${({gap = 0}) => css`
        margin-bottom: ${gap}px;
    `};
`;

export const Inner = styled.View`
    align-items: flex-start;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;
    z-index: 1;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.medium)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px
            ${theme.adaptSize(theme.spacing.medium)}px;

        min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `};
`;

export const Leading = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${theme.adaptSize(theme.spacing.small * 5)}px;
    `}
`;

export const Content = styled.View<ContentProps>`
    align-self: stretch;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
    pointer-events: none;

    ${({supportingTextShow, theme}) =>
        supportingTextShow &&
        css`
            min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        `}
`;

export const Trailing = styled.View`
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

export const TrailingInner = styled(Leading)``;
export const Headline = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
    `}
`;

export const SupportingText = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.surface.onSurfaceVariant};
        height: auto;
    `}
`;
