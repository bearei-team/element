import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './TextFieldBase';

export type HeaderInnerProps = Pick<RenderProps, 'type' | 'multiline'> & {
    leadingShow: boolean;
    trailingShow: boolean;
};

export type LabelTextProps = {
    scale?: boolean;
    leadingShow: boolean;
};

export interface ActiveIndicatorProps {
    width?: number;
}

export type ContentProps = Pick<RenderProps, 'multiline'>;
export type ControlProps = {height?: number} & ContentProps;
export type TextInputProps = {multilineText?: boolean};

export const Container = styled.View``;
export const Inner = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

export const Header = styled.Pressable``;
export const HeaderInner = styled(Shape)<HeaderInnerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
                ${theme.adaptSize(theme.spacing.none)}px;
        `}

    ${({theme, leadingShow}) =>
        !leadingShow &&
        css`
            padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
        `}


    ${({theme, trailingShow}) =>
        !trailingShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
        `}

    ${({theme, multiline}) =>
        multiline &&
        css`
            height: auto;
            min-height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        `}
`;

export const LabelText = styled(Typography)<LabelTextProps>`
    pointer-events: none;
    position: absolute;

    ${({theme}) => css`
        left: ${theme.adaptSize(theme.spacing.medium)}px;
    `}

    ${({theme, leadingShow}) =>
        leadingShow &&
        css`
            left: ${theme.adaptSize(theme.spacing.small * 6)}px;
        `}
`;

export const Trailing = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
    `}
`;

export const Leading = styled(Trailing)``;
export const Content = styled.View<ContentProps>`
    flex: 1;

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.spacing.small * 6)}px;
        padding: ${theme.adaptSize(theme.spacing.extraSmall + theme.spacing.medium)}px
            ${theme.adaptSize(theme.spacing.none)}px ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `};

    ${({theme, multiline}) =>
        multiline &&
        css`
            height: auto;
            min-height: ${theme.adaptFontSize(theme.spacing.small * 6)}px;
        `}
`;

export const Control = styled.View<ControlProps>`
    display: flex;
    flex-direction: row;
    align-items: center;

    ${({theme}) =>
        theme.OS === 'macos' &&
        css`
            flex: 1;
        `};

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.typography.body.large.lineHeight)}px;
    `};

    ${({height, multiline, theme}) => {
        const multilineText = multiline && typeof height === 'number' && height !== 0;

        return (
            multilineText &&
            height > theme.adaptFontSize(theme.typography.body.large.lineHeight) &&
            css`
                height: ${height}px;
            `
        );
    }};
`;

export const Input = styled(TextInput)<TextInputProps>`
    flex: 1;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        padding: ${theme.spacing.none}px;
    `};

    ${({multilineText, theme}) =>
        multilineText &&
        theme.OS === 'web' &&
        css`
            align-self: stretch;
        `};
`;

export const SupportingText = styled(Typography)`
    ${({theme}) => css`
        padding: ${theme.adaptSize(theme.spacing.none)}px ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;

export const ActiveIndicator = styled.View<ActiveIndicatorProps>`
    position: absolute;

    ${({width = 0, theme}) => css`
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        height: ${theme.adaptSize(theme.spacing.extraSmall / 2)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
        width: ${width}px;
    `}
`;
