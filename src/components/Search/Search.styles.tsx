import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

type InnerProps = {
    trailingShow: boolean;
};

type SearchListProps = {
    containerPageX?: number;
    containerPageY?: number;
    containerHeight?: number;
    renderStyle?: {
        width?: number;
    };
};

export const Container = styled(Shape)`
    align-self: stretch;
    overflow: hidden;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surfaceContainerHigh};
        height: ${theme.adaptSize(theme.spacing.small * 7)}px;
    `};
`;

export const Inner = styled.Pressable<InnerProps>`
    cursor: text;
    align-items: center;
    flex-direction: row;
    flex: 1;
    justify-content: space-between;
    position: relative;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `};

    ${({theme, trailingShow}) =>
        !trailingShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
        `}
`;

export const Leading = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 6)}px;
            width: ${theme.adaptSize(theme.spacing.small * 6)}px;
        `};
`;

export const Content = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 1;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        `};
`;

export const TextField = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex: 1;

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.typography.body.large.lineHeight)}px;
    `};
`;

export const Input = styled(TextInput)`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
        min-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
        padding: ${theme.spacing.none}px;
    `};
`;

export const Trailing = styled(Leading)``;
export const SearchList = styled.View<SearchListProps>`
    position: absolute;

    ${({renderStyle = {}}) => {
        const {width = 0} = renderStyle;

        return css`
            width: ${width}px;
        `;
    }}

    ${({containerPageX = 0, containerPageY = 0, containerHeight = 0}) => css`
        left: ${containerPageY}px;
        top: ${containerPageX + containerHeight}px;
    `};
`;
