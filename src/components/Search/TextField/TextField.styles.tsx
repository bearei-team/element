import {TextInput} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';

type ContainerProps = {
    pageX: number;
    pageY: number;
    renderStyle?: {width?: number};
};

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    overflow: hidden;
    position: absolute;
    z-index: 2048;

    ${({theme, renderStyle = {}, pageX = 0, pageY = 0}) => {
        const {width = 0} = renderStyle;

        return css`
            background-color: ${theme.palette.surface.surfaceContainerHigh};
            left: ${pageX}px;
            top: ${pageY}px;
            width: ${width}px;
        `;
    }};
`;

export const Header = styled.Pressable`
    align-items: center;
    align-self: stretch;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: relative;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `};
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
