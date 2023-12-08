import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './TextFieldBase';

export type HeaderInnerProps = Pick<RenderProps, 'type'> & {
    leadingIconShow: boolean;
    trailingIconShow: boolean;
};

export type LabelProps = Pick<RenderProps, 'type'>;
export type SupportingTextProps = Pick<RenderProps, 'error'>;
export interface LabelTextBackgroundProps {
    height: number;
    width: number;
}

export type ActiveIndicatorProps = Pick<LabelTextBackgroundProps, 'width'>;

export const Container = styled.View`
    display: flex;
    flex-direction: column;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
    `}
`;

export const Header = styled.View``;
export const HeaderPressable = styled.Pressable``;
export const HeaderInner = styled(Shape)<HeaderInnerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(56)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px 0;
        `}

    ${({theme, leadingIconShow}) =>
        !leadingIconShow &&
        css`
            padding-left: ${theme.adaptSize(theme.spacing.medium)}px;
        `}


    ${({theme, trailingIconShow}) =>
        !trailingIconShow &&
        css`
            padding-right: ${theme.adaptSize(theme.spacing.medium)}px;
        `}

        ${({type}) =>
        type === 'outlined' &&
        css`
            border-style: 'solid';
        `}
`;

export const Content = styled.View`
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;
`;

export const Label = styled.Text<LabelProps>`
    ${({theme}) => css`
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
    `};

    ${({type}) =>
        type === 'outlined' &&
        css`
            position: absolute;
            z-index: 1;
        `};
`;

export const LabelText = styled.Text`
    opacity: 0;
    position: absolute;
    white-space: nowrap;
    z-index: -1024;

    ${({theme}) => css`
        color: ${theme.color.rgba(theme.palette.surface.onSurfaceVariant, 0)};
        font-size: ${theme.adaptFontSize(theme.typography.body.small.size)}px;
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
        left: ${theme.adaptSize(theme.spacing.medium - theme.spacing.small)}px;
        letter-spacing: ${theme.adaptSize(theme.typography.body.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.small.lineHeight)}px;
        padding: ${theme.adaptSize(0)}px ${theme.adaptSize(theme.spacing.small)}px;
        top: ${theme.adaptSize(-theme.typography.body.small.lineHeight / 2)}px;
    `};
`;

export const LabelTextBackground = styled.View<LabelTextBackgroundProps>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: absolute;

    ${({theme, width, height}) => css`
        height: ${height};
        left: ${theme.adaptSize(theme.spacing.medium - theme.spacing.small)}px;
        top: ${theme.adaptSize(-theme.typography.body.small.lineHeight / 2)}px;
        width: ${width}px;
    `};
`;

export const LabelTextBackgroundInner = styled.View`
    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};
`;

export const Input = styled(TextInput)`
    outline-style: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.large.lineHeight)}px;
    `};
`;

export const ActiveIndicator = styled.View<ActiveIndicatorProps>`
    bottom: 0;
    left: 0;
    position: absolute;

    ${({width}) => css`
        width: ${width}px;
    `}
`;

export const TrailingIcon = styled.View`
    ${({theme}) => css`
        height: ${theme.adaptSize(48)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px ${theme.adaptSize(theme.spacing.small)}px;
        width: ${theme.adaptSize(48)}px;
    `}
`;

export const LeadingIcon = styled(TrailingIcon)``;
export const SupportingText = styled.Text<SupportingTextProps>`
    ${({theme}) => css`
        font-size: ${theme.adaptSize(theme.typography.body.small.size)}px;
        font-style: ${theme.typography.body.small.style};
        font-weight: ${theme.typography.body.small.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.body.small.lineHeight)}px;
        padding: ${theme.adaptSize(0)}px ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;
