import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {ButtonProps} from './Button';

export type ContainerProps = Pick<ButtonProps, 'type'> & {showIcon: boolean};
export type LabelProps = Omit<ContainerProps, 'showIcon'>;

const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        gap: ${theme.adaptSize(theme.spacing.small)}px;
    `}

    ${({theme, type = 'filled'}) => {
        const mainType = {
            elevated: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.large)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            filled: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.large)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            outlined: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.large)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            text: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.medium - 4)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
            tonal: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.large)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.small + 2)}px;
            `,
        };

        return mainType[type];
    }}

    ${({showIcon, theme, type = 'filled'}) => {
        const mainType = {
            elevated: css`
                padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            filled: css`
                padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            outlined: css`
                padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
            text: css`
                padding-horizontal-end: ${theme.adaptSize(theme.spacing.medium)}px;
                padding-start: ${theme.adaptSize(theme.spacing.medium - 4)}px;
            `,
            tonal: css`
                padding-start: ${theme.adaptSize(theme.spacing.medium)}px;
            `,
        };

        return showIcon && mainType[type];
    }}
`;

const Label = styled.Text<LabelProps>`
    user-select: none;

    ${({theme}) => css`
        font-size: ${theme.adaptFontSize(theme.typography.label.large.size)}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.large.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.large.lineHeight)}px;
    `}
`;

const Icon = styled.View`
    overflow: hidden;

    ${({theme}) => css`
        height: ${theme.adaptSize(18)}px;
        width: ${theme.adaptSize(18)}px;
    `}
`;

export {Container, Icon, Label};
