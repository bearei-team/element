import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './ItemBase';

export type IconInnerProps = Pick<RenderProps, 'pressPosition'>;
export type LabelTextProps = Pick<RenderProps, 'active'>;

export const Container = styled(View)`
    align-items: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    flex: 1;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        max-height: ${theme.adaptSize(80)}px;
        min-width: ${theme.adaptSize(72)}px;
        padding-bottom: ${theme.adaptSize(theme.spacing.medium)}px;
        padding-top: ${theme.adaptSize(theme.spacing.medium - theme.spacing.extraSmall)}px;
    `}
`;

export const IconContainer = styled.Pressable<IconInnerProps>`
    display: flex;
    flex-direction: row;
    position: relative;

    ${({theme}) => css`
        width: ${theme.adaptSize(24 + (theme.spacing.large - theme.spacing.extraSmall) * 2)}px;
        height: ${theme.adaptSize(24 + theme.spacing.extraSmall * 2)}px;
    `}

    ${({pressPosition}) => {
        const isRight = pressPosition > 0.6;
        const justify = isRight ? 'flex-end' : 'flex-start';
        const isCenter = pressPosition > 0.4 && pressPosition < 0.6;

        return css`
            justify-content: ${isCenter ? 'center' : justify};
        `;
    }}
`;

export const IconBackground = styled(Shape)`
    align-items: center;
    display: flex;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        padding: ${theme.adaptSize(theme.spacing.extraSmall)}px
            ${theme.adaptSize(theme.spacing.large - theme.spacing.extraSmall)}px;
    `}
`;

export const Icon = styled(View)`
    pointer-events: none;
    position: absolute;

    ${({theme}) => css`
        top: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        left: ${theme.adaptSize(
            (24 + (theme.spacing.large - theme.spacing.extraSmall) * 2) / 2 - 24 / 2,
        )}px;
        height: ${theme.adaptSize(24)}px;
        width: ${theme.adaptSize(24)}px;
    `}
`;

export const LabelText = styled.Text<LabelTextProps>`
    overflow: hidden;

    ${({theme, active}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        letter-spacing: ${theme.adaptSize(theme.typography.label.medium.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
        font-weight: ${active ? theme.font.weight.bold : theme.font.weight.medium};
    `}
`;
