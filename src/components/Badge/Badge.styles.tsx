import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Shape.styles';
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
                max-width: 34px;
                min-width: 16px;
                padding-horizontal: ${theme.spacing.extraSmall}px;
            `,

            medium: css`
                max-width: 34px;
                min-width: 16px;
                padding-horizontal: ${theme.spacing.extraSmall}px;
            `,

            small: css`
                padding-horizontal: ${theme.spacing.extraSmall - 2}px;
                padding-vertical: ${theme.spacing.extraSmall - 2}px;
            `,
        };

        return containerSize[size];
    }}
`;

const Label = styled.Text`
    min-height: 2px;
    min-width: 2px;

    ${({theme}) => css`
        color: ${theme.palette.error.onError};
        font-size: ${theme.typography.label.small.size}px;
        font-style: ${theme.typography.label.small.style};
        font-weight: ${theme.typography.label.small.weight};
        letter-spacing: ${theme.typography.label.small.letterSpacing}px;
        line-height: ${theme.typography.label.small.lineHeight}px;
    `}
`;

export {Container, Label};
