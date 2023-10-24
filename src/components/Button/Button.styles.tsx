import styled, {css} from 'styled-components/native';
import {ButtonProps} from './Button';
import {State} from '../common/interface';
import {Shape} from '../Common/Shape.styles';

export type MainProps = Pick<ButtonProps, 'type'> & {state: State; showIcon?: boolean};
export type LabelProps = MainProps;
export const Main = styled(Shape)<MainProps>`
    overflow: hidden;
    pointer-events: none;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 40px;

    ${({theme}) => css`
        gap: ${theme.spacing.small}px;
    `}

    ${({theme, type = 'filled'}) => {
        const themeType = {
            filled: css`
                background-color: ${theme.palette.primary.primary};
                padding-vertical: ${theme.spacing.small + 2}px;
                padding-horizontal: ${theme.spacing.large}px;
            `,

            outlined: css`
                padding-vertical: ${theme.spacing.small + 2}px;
                padding-horizontal: ${theme.spacing.large}px;
            `,
            text: css`
                padding-vertical: ${theme.spacing.small + 2}px;
                padding-horizontal: ${theme.spacing.medium - 4}px;
            `,
            elevated: css`
                background-color: ${theme.palette.surface.surfaceContainerLow};
                padding-vertical: ${theme.spacing.small + 2}px;
                padding-horizontal: ${theme.spacing.large}px;
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
                padding-horizontal-start: ${theme.spacing.medium}px;
            `,

            outlined: css`
                padding-horizontal-start: ${theme.spacing.medium}px;
            `,
            text: css`
                padding-horizontal-start: ${theme.spacing.medium - 4}px;
                padding-horizontal-end: ${theme.spacing.medium}px;
            `,
            elevated: css``,
        };

        return showIcon && themeType[type];
    }}
`;

export const Label = styled.Text<LabelProps>`
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
