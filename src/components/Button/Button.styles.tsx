import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {ButtonProps} from './Button';

export type ContainerProps = Pick<ButtonProps, 'type'> & {showIcon: boolean};
export type LabelProps = Omit<ContainerProps, 'showIcon'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding-inline: ${theme.adaptSize(theme.spacing.large)}px;
                padding-block: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            filled: css`
                padding-inline: ${theme.adaptSize(theme.spacing.large)}px;
                padding-block: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            outlined: css`
                padding-inline: ${theme.adaptSize(theme.spacing.large)}px;
                padding-block: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            text: css`
                padding-inline: ${theme.adaptSize(theme.spacing.medium - 4)}px;
                padding-block: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            tonal: css`
                padding-inline: ${theme.adaptSize(theme.spacing.large)}px;
                padding-block: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
        };

        return containerType[type];
    }}

    ${({showIcon, theme, type = 'filled'}) => {
        const containerType = {
            elevated: css`
                padding-inline-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filled: css`
                padding-inline-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            outlined: css`
                padding-inline-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            text: css`
                padding-inline-end: ${theme.adaptSize(theme.spacing.medium)}px;
                padding-inline-start: ${theme.adaptSize(theme.spacing.medium - 4)}px;
            `,
            tonal: css`
                padding-inline-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
        };

        return showIcon && containerType[type];
    }}
`;

export const Label = styled.Text<LabelProps>`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.large.lineHeight)}px;
    `}
`;

export const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(18)}px;
        width: ${theme.adaptSize(18)}px;
    `}
`;
