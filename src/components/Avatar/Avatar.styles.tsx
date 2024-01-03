import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './AvatarBase';

export type ContainerProps = Pick<RenderProps, 'width' | 'height'>;
export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: inline-flex;
    justify-content: center;
    pointer-events: none;

    ${({height, theme, width}) => css`
        background-color: ${theme.palette.primary.primaryContainer};
        height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
        width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
    `}
`;

export const LabelText = styled.Text`
    ${({theme}) => css`
        color: ${theme.palette.primary.onPrimaryContainer};
        font-size: ${theme.adaptFontSize(theme.typography.title.medium.size)}px;
        font-style: ${theme.typography.title.medium.style};
        font-weight: ${theme.typography.title.medium.weight};
        height: ${theme.adaptSize(theme.typography.title.medium.lineHeight)}px;
        letter-spacing: ${theme.adaptSize(
            theme.typography.title.medium.letterSpacing,
        )}px;

        line-height: ${theme.adaptSize(
            theme.typography.title.medium.lineHeight,
        )}px;
    `}
`;
