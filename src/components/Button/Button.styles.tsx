import styled, {css} from 'styled-components/native';
import {ButtonProps} from './Button';
import {State} from '../../common/interface';

export type MainProps = Pick<ButtonProps, 'type'> & {state: State; showIcon?: boolean};
export type Label = MainProps;

export const Main = styled.View<MainProps>`
    display: flex;
    flex-direction: row;
    height: 40px;

    ${({theme}) => css`
        gap: ${theme.spacing.small}px;
    `}

    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                background-color: ${theme.palette.primary.primary};
                padding-block: ${theme.spacing.small + 2}px;
                padding-inline: ${theme.spacing.large}px;
            `,

            outlined: css`
                padding-block: ${theme.spacing.small + 2}px;
                padding-inline: ${theme.spacing.large}px;
            `,
            text: css`
                padding-block: ${theme.spacing.small + 2}px;
                padding-inline: ${theme.spacing.medium - 4}px;
            `,
            elevated: css`
                background-color: ${theme.palette.surface.surfaceContainerLow};
                padding-block: ${theme.spacing.small + 2}px;
                padding-inline: ${theme.spacing.large}px;
            `,
        };

        return themeType[type];
    }}

    ${({theme, state, type = 'filled'}) => {
        const themeType = {
            filled: css`
                background-color: ${theme.color.rgba(theme.palette.surface.onSurface, 0.12)};
            `,

            outlined: css``,
            text: css``,
            elevated: css``,
        };

        return state === 'disabled' && themeType[type];
    }}

    ${({theme, type = 'filled', showIcon}) => {
        const themeType = {
            filled: css`
                padding-inline-start: ${theme.spacing.medium}px;
            `,

            outlined: css`
                padding-inline-start: ${theme.spacing.medium}px;
            `,
            text: css`
                padding-inline-start: ${theme.spacing.medium - 4}px;
                padding-inline-end: ${theme.spacing.medium}px;
            `,
            elevated: css``,
        };

        return showIcon && themeType[type];
    }}
`;

export const Label = styled.Text<Label>`
    ${({theme}) => css`
        font-size: ${theme.typography.label.large.size}px;
        font-style: ${theme.typography.label.large.style};
        font-weight: ${theme.typography.label.large.weight};
        line-height: ${theme.typography.label.large.lineHeight}px;
        letter-spacing: ${theme.typography.label.large.letterSpacing}px;
        color: ${theme.palette.primary.onPrimary};
    `}

    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                color: ${theme.palette.primary.onPrimary};
            `,

            outlined: css`
                color: ${theme.palette.primary.primary};
            `,
            text: css`
                color: ${theme.palette.primary.primary};
            `,
            elevated: css`
                color: ${theme.palette.primary.primary};
            `,
        };

        return themeType[type];
    }}

    ${({theme, state}) =>
        state === 'disabled' &&
        css`
            color: ${theme.color.rgba(theme.palette.surface.onSurface, 0.38)};
        `}
`;

export const Icon = styled.View`
    width: 18px;
    height: 18px;
    overflow: hidden;
`;
