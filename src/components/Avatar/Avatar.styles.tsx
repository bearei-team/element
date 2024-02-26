import styled, {css} from 'styled-components/native';
import {Shape, Typography} from '../Common/Common.styles';
import {RenderProps} from './AvatarBase';

type ContainerProps = Pick<RenderProps, 'renderStyle'>;

export const Container = styled(Shape)<ContainerProps>`
    align-items: center;
    display: flex;
    justify-content: center;
    pointer-events: none;

    ${({theme, renderStyle = {}}) => {
        const {width, height} = renderStyle;

        return css`
            background-color: ${theme.palette.primary.primaryContainer};
            height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
        `;
    }}
`;

export const LabelText = styled(Typography)`
    ${({theme}) => css`
        color: ${theme.palette.primary.onPrimaryContainer};
        max-width: ${theme.adaptSize(theme.spacing.small + theme.spacing.extraSmall)}px;
    `}
`;
