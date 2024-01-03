import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './BadgeBase';

export type ContainerProps = Pick<RenderProps, 'size'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: inline-flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;

    ${({theme}) => css`
        background-color: ${theme.palette.error.error};
    `}

    ${({theme, size = 'medium'}) => {
        const containerSize = {
            large: css`
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            medium: css`
                min-width: ${theme.adaptSize(theme.spacing.medium)}px;
                padding: ${theme.adaptSize(theme.spacing.none)}px
                    ${theme.adaptSize(theme.spacing.extraSmall)}px;
            `,

            small: css`
                width: ${theme.adaptSize(theme.spacing.small - 2)}px;
                height: ${theme.adaptSize(theme.spacing.small - 2)}px;
                padding: ${theme.adaptSize(theme.spacing.extraSmall - 2)}px;
            `,
        };

        return containerSize[size];
    }}
`;

export const LabelText = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.error.onError};
        font-size: ${theme.adaptFontSize(theme.typography.label.small.size)}px;
        font-style: ${theme.typography.label.small.style};
        font-weight: ${theme.typography.label.small.weight};
        height: ${theme.adaptSize(theme.typography.label.small.lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography.label.small.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.label.small.lineHeight,
        )}px;
    `}
`;
