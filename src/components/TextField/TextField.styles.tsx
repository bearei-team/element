import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography, TypographyProps} from '../Common/Common.styles';
import {RenderProps} from './TextFieldBase';

type HeaderInnerProps = Pick<RenderProps, 'type' | 'multiline'> & {
    leadingShow: boolean;
    trailingShow: boolean;
};

type LabelProps = {
    scale?: boolean;
    leadingShow: boolean;
} & TypographyProps;

interface ActiveIndicatorProps {
    renderStyle?: {width?: number};
}

type ContentProps = Pick<RenderProps, 'multiline'>;
type ControlProps = {renderStyle?: {height?: number}} & ContentProps;
type TextInputProps = {multilineText?: boolean};

export const Container = styled.View``;
export const Inner = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

export const Header = styled.Pressable`
    cursor: text;
`;

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

export const Label = styled.View<LabelProps>`
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

export const LabelInner = styled.View``;
export const LabelText = styled(Typography)``;
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

    ${({renderStyle = {}, multiline, theme}) => {
        const {height = 0} = renderStyle;
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

/**
 * Using secureTextEntry props in macOS with text-related styles on the input box will cause the
 * enableFocusRing setting to be invalidated. It is uncertain whether this is a bug in
 * react-native-macos or a native bug. As a temporary workaround, if you use secureTextEntry
 * in macos, it does not provide text styles.
 */
export const Input = styled(TextInput)<TextInputProps>`
    flex: 1;

    ${({theme, secureTextEntry}) =>
        !secureTextEntry &&
        css`
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

    ${({theme}) => css`
        bottom: ${theme.adaptSize(theme.spacing.none)}px;
        left: ${theme.adaptSize(theme.spacing.none)}px;
        right: ${theme.adaptSize(theme.spacing.none)}px;
        height: ${theme.adaptSize(theme.spacing.extraSmall / 2)}px;
    `}
`;
