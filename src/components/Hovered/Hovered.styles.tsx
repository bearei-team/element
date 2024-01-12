import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './HoveredBase';

export type ContainerProps = Pick<RenderProps, 'underlayColor' | 'width' | 'height'>;

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;
    z-index: 2048;

    ${({theme}) =>
        css`
            left: ${theme.adaptSize(theme.spacing.none)}px;
            top: ${theme.adaptSize(theme.spacing.none)}px;
        `}

    ${({underlayColor, width = 0, height = 0}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
            height: ${height}px;
            width: ${width}px;
        `}
`;
