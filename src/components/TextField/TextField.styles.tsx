import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {TextFieldProps} from './TextField';

export type MainProps = Pick<TextFieldProps, 'type'> & {
    leadingIconShow: boolean;
    trailingIconShow: boolean;
};

export type LabelProps = Pick<TextFieldProps, 'type'>;
export type SupportingTextProps = Pick<TextFieldProps, 'error'>;
export interface LabelPlaceholderProps {
    height: number;
    width: number;
}

export interface LabelPlaceholderFixProps {
    height: number;
    labelPlaceholderWidth: number;
}

const Container = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

const Core = styled.View``;
const CoreInner = styled.Pressable``;
const Main = styled(Shape)<MainProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(56)}px;
            padding-vertical: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `}

    ${({theme, leadingIconShow}) =>
        !leadingIconShow &&
        css`
            padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
        `}


    ${({theme, trailingIconShow}) =>
        !trailingIconShow &&
        css`
            padding-end: ${theme.adaptSize(theme.spacing.medium)}px;
        `}

        ${({type}) =>
        type === 'outlined' &&
        css`
            border-style: 'solid';
        `}
`;

const Content = styled.View`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
`;

const LabelPlaceholder = styled.View<LabelPlaceholderProps>`
    position: absolute;

    z-index: 2;

    ${({height, theme, width}) => css`
        top: ${theme.adaptSize(-8)} px;
        height: ${theme.adaptSize(height)}px;
        left: ${theme.adaptSize(16 - theme.spacing.small)}px;
        width: ${theme.adaptSize(width)}px;
    `};
`;

const LabelPlaceholderFix = styled.View<LabelPlaceholderFixProps>`
    position: absolute;
    top: 0;

    ${({height, theme}) => css`
        background-color: ${theme.palette.surface.surface};
        height: ${theme.adaptSize(height)}px;
    `};
`;

const LabelPlaceholderBefore = styled(LabelPlaceholderFix)`
    ${({labelPlaceholderWidth, theme}) => css`
        right: ${theme.adaptSize(labelPlaceholderWidth / 2)}px;
    `};
`;

const LabelPlaceholderAfter = styled(LabelPlaceholderFix)`
    ${({labelPlaceholderWidth, theme}) => css`
        left: ${theme.adaptSize(labelPlaceholderWidth / 2)}px;
    `};
`;

const LabelPlaceholderText = styled.Text`
    opacity: 0;
    position: absolute;
    white-space: nowrap;
    z-index: 2;

    ${({theme}) => css`
        color: ${theme.color.rgba(theme.palette.surface.onSurfaceVariant, 0)};
        font-size: ${theme.adaptFontSize(theme.typography.body.small.size)}px;
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
        left: ${theme.adaptSize(16 - theme.spacing.small)}px;
        letter-spacing: ${theme.adaptSize(theme.typography.body.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.small.lineHeight)}px;
        padding-horizontal: ${theme.adaptSize(theme.spacing.small)}px;
        top: ${theme.adaptSize(-8)} px;
    `};
`;

const Label = styled.Text<LabelProps>`
    ${({theme}) => css`
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
    `};

    ${({type}) =>
        type === 'outlined' &&
        css`
            position: absolute;
            z-index: 3;
        `};
`;

const Input = styled(TextInput)`
    outline-style: none;

    ${({theme}) => css`
        color: ${theme.palette.surface.onSurface};
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
    `}
`;

const ActiveIndicator = styled.View`
    bottom: 0;
    left: 0;
    position: absolute;
    width: 100%;
`;

const Icon = styled.View`
    align-items: center;
    display: flex;

    justify-content: center;

    ${({theme}) => css`
        height: ${theme.adaptSize(48)}px;
        padding-horizontal: ${theme.adaptSize(theme.spacing.small)}px;
        padding-vertical: ${theme.adaptSize(theme.spacing.small)}px;
        width: ${theme.adaptSize(48)}px;
    `}
`;

const TrailingIcon = styled(Icon)``;
const LeadingIcon = styled(Icon)``;
const SupportingText = styled.Text<SupportingTextProps>`
    ${({theme}) => css`
        font-size: ${theme.adaptSize(theme.typography.body.small.size)}px;
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.small.lineHeight)}px;
        padding-horizontal: ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;

export {
    ActiveIndicator,
    Container,
    Content,
    Core,
    CoreInner,
    Input,
    Label,
    LabelPlaceholder,
    LabelPlaceholderAfter,
    LabelPlaceholderBefore,
    LabelPlaceholderText,
    LeadingIcon,
    Main,
    SupportingText,
    TrailingIcon,
};
