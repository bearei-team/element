import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export type InnerProps = {width: number};
export const Container = styled.View`
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
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
    overflow: hidden;

    ${({theme, width}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainerHigh};
            width: ${width}px;
        `};
`;

export const Header = styled.Pressable<InnerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

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
            height: ${theme.adaptSize(theme.spacing.small * 6)}px;
            padding: ${theme.adaptSize(theme.spacing.small)}px;
            width: ${theme.adaptSize(theme.spacing.small * 6)}px;
        `};
`;

export const Content = styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.large)}px;
        `};
`;

export const Input = styled(TextInput)`
    flex: 1;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography.body.large.letterSpacing,
        )}px;
    `};
`;

export const TrailingIcon = styled(LeadingIcon)``;
