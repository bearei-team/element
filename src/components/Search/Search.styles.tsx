import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export type InnerProps = {width: number};

export type HeaderProps = InnerProps;

export const Container = styled.View`
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(56)}px;
        `};
`;

export const Inner = styled(Shape)<InnerProps>`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    left: 0;
    position: absolute;
    top: 0;
    z-index: 2048;

    ${({theme, width}) =>
        css`
            width: ${width}px;
            background-color: ${theme.palette.surface.surfaceContainerHigh};
        `};
`;

export const Header = styled.View<HeaderProps>`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    ${({theme, width}) =>
        css`
            width: ${width}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `};
`;

export const LeadingIcon = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) =>
        css`
            width: ${theme.adaptSize(48)}px;
            height: ${theme.adaptSize(48)}px;
            padding: ${theme.adaptSize(theme.spacing.small)}px;
        `};
`;

export const Content = styled.View`
    flex: 1;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(48)}px;
        `};
`;

export const Input = styled(TextInput)`
    outline-style: none;
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
    `};
`;

export const TrailingIcon = styled(LeadingIcon)``;
