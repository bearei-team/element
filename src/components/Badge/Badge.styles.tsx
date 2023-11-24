import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {BadgeProps} from './Badge';

export type ContainerProps = Pick<BadgeProps, 'size'>;

const Container = styled(Shape)<ContainerProps>`
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
                max-width: ${theme.adaptSize(34)}px;
                min-width: ${theme.adaptSize(16)}px;
                padding-horizontal: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            medium: css`
                max-width: ${theme.adaptSize(34)}px;
                min-width: ${theme.adaptSize(16)}px;
                padding-horizontal: ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            small: css`
                padding-horizontal: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
                padding-vertical: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
            `,
        };

        return containerSize[size];
    }}
`;

const Label = styled.Text`
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

export {Container, Label};
