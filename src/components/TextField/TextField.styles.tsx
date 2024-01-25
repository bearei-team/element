import {TextInput} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './TextFieldBase';

export type HeaderInnerProps = Pick<RenderProps, 'type'> & {
    leadingIconShow: boolean;
    trailingIconShow: boolean;
};

export type LabelTextProps = {
    scale?: boolean;
};

export interface ActiveIndicatorProps {
    width?: number;
}

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
    pointer-events: none;
    position: relative;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
            padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
                ${theme.adaptSize(theme.spacing.none)}px;
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
`;

export const LabelText = styled(Typography)<LabelTextProps>`
    position: absolute;

    ${({theme}) => css`
        left: ${theme.adaptSize(theme.spacing.medium)}px;
    `}
`;

export const TrailingIcon = styled.View`
    ${({theme}) => css`
        height: ${theme.adaptSize(theme.spacing.small * 6)}px;
        width: ${theme.adaptSize(theme.spacing.small * 6)}px;
        padding: ${theme.adaptSize(theme.spacing.small)}px ${theme.adaptSize(theme.spacing.small)}px;
    `}
`;

export const LeadingIcon = styled(TrailingIcon)``;
export const Content = styled.View`
    align-items: flex-end;
    display: flex;
    flex-direction: row;
    flex: 1;
    pointer-events: none;

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.spacing.small * 6)}px;
        padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.none)}px;
    `};
`;

export const TextField = styled.View`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;

    ${({theme}) => css`
        height: ${theme.adaptFontSize(theme.typography.body.large.lineHeight)}px;
    `};
`;

export const Input = styled(TextInput)`
    flex: 1;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.body.large.size)}px;
        font-style: ${theme.typography.body.large.style};
        font-weight: ${theme.typography.body.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.body.large.letterSpacing)}px;
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
