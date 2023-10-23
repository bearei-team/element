import styled, {css} from 'styled-components/native';
import {ButtonProps} from './Button';

export type ContainerProps = Pick<ButtonProps, 'type'>;
export type MainProps = Pick<ButtonProps, 'type'>;
export const Container = styled.View<ContainerProps>``;
export const Main = styled.View<MainProps>`
    display: flex;
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

            outlined: css``,
            text: css``,
            elevated: css``,
        };

        return themeType[type];
    }}
`;

export const Label = styled.Text`
    ${({theme}) => css`
        font-size: ${theme.typography.label.large.size}px;
        font-style: ${theme.typography.label.large.style}px;
        font-weight: ${theme.typography.label.large.weight}px;
        line-height: ${theme.typography.label.large.lineHeight}px;
        letter-spacing: ${theme.typography.label.large.letterSpacing}px;
        color: ${theme.palette.primary.onPrimary};
    `}
`;

export const Icon = styled.View``;
