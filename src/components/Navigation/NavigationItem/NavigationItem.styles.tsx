import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../../Common/Common.styles';
import {RenderProps} from './NavigationItemBase';

export type IconInnerProps = Pick<RenderProps, 'pressPosition'>;
export type LabelTextProps = Pick<RenderProps, 'active'>;

export const Container = styled(View)``;

export const Inner = styled(View)`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        min-width: ${theme.adaptSize(theme.spacing.small * 8)}px;
    `}
`;

export const Header = styled.View<IconInnerProps>`
    display: flex;
    flex-direction: row;
    position: relative;

    ${({theme}) => css`
        width: ${theme.adaptSize(
            theme.spacing.large +
                (theme.spacing.large - theme.spacing.extraSmall) * 2,
        )}px;

        height: ${theme.adaptSize(
            theme.spacing.large + theme.spacing.extraSmall * 2,
        )}px;
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
            (theme.spacing.large +
                (theme.spacing.large - theme.spacing.extraSmall) * 2) /
                2,
        ) -
        theme.spacing.large / 2}px;

        height: ${theme.adaptSize(theme.spacing.large)}px;
        width: ${theme.adaptSize(theme.spacing.large)}px;
    `}
`;

export const LabelText = styled.Text<LabelTextProps>`
    overflow: hidden;

    ${({theme, active}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.medium.size)}px;
        font-style: ${theme.typography.label.medium.style};
        height: ${theme.adaptSize(theme.typography.label.medium.lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography.label.medium.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.label.medium.lineHeight,
        )}px;

        font-weight: ${active
            ? theme.font.weight.bold
            : theme.font.weight.medium};
    `}
`;
