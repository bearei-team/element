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
            background-color: ${theme.palette.surface.surfaceContainerHigh};
            width: ${width}px;
        `};
`;

export const Header = styled.View<HeaderProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    ${({theme, width}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            width: ${width}px;
        `};
`;

export const LeadingIcon = styled.View`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(48)}px;
            padding: ${theme.adaptSize(theme.spacing.small)}px;
            width: ${theme.adaptSize(48)}px;
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
    flex: 1;
    outline-style: none;

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
