import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {BadgeProps} from './Badge';

export type ContainerProps = Pick<BadgeProps, 'size'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: inline-flex;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        background-color: ${theme.palette.error.error};
    `}

    ${({theme, size = 'medium'}) => {
        const containerSize = {
            large: css`
                min-width: ${theme.adaptSize(16)}px;
                padding-inline: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            medium: css`
                min-width: ${theme.adaptSize(16)}px;
                padding-block: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            small: css`
                padding-inline: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
                padding-block: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
            `,
        };

        return containerSize[size];
    }}
`;

export const Label = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.error.onError};
        font-size: ${theme.adaptFontSize(theme.typography.label.small.size)}px;
        font-style: ${theme.typography.label.small.style};
        font-weight: ${theme.typography.label.small.weight};
        letter-spacing: ${theme.adaptSize(theme.typography.label.small.letterSpacing)}px;
        line-height: ${theme.adaptSize(theme.typography.label.small.lineHeight)}px;
        min-height: ${theme.adaptSize(2)}px;
        min-width: ${theme.adaptSize(2)}px;
    `}
`;
