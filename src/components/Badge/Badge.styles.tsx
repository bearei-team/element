import styled, {css} from 'styled-components/native';
import {BadgeProps} from './Badge';
import {Shape} from '../Common/Shape.styles';

export type ContainerProps = Pick<BadgeProps, 'size'>;

export const Container = styled(Shape)<ContainerProps>`
    display: inline-flex;
    justify-content: center;
    align-items: center;

    ${({theme}) => css`
        background-color: ${theme.palette.error.error};
    `}

    ${({theme, size = 'medium'}) => {
        const themeType = {
            large: css`
                padding-horizontal: ${theme.spacing.extraSmall}px;
                min-width: 16px;
                max-width: 34px;
            `,

            medium: css``,

            small: css`
                padding-horizontal: ${theme.spacing.extraSmall - 2}px;
                padding-vertical: ${theme.spacing.extraSmall - 2}px;
            `,
        };

        return themeType[size];
    }}
`;

export const Label = styled.Text`
    min-width: 2px;
    min-height: 2px;

    ${({theme}) => css`
        font-size: ${theme.typography.label.small.size}px;
        font-style: ${theme.typography.label.small.style};
        font-weight: ${theme.typography.label.small.weight};
        line-height: ${theme.typography.label.small.lineHeight}px;
        letter-spacing: ${theme.typography.label.small.letterSpacing}px;
        color: ${theme.palette.error.onError};
    `}
`;
