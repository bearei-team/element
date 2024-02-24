import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './HoveredBase';

export interface ContainerProps extends Pick<RenderProps, 'underlayColor'> {
    renderStyle?: {
        width?: number;
        height?: number;
    };
}

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;
    z-index: 2048;

    ${({theme}) =>
        css`
            left: ${theme.adaptSize(theme.spacing.none)}px;
            top: ${theme.adaptSize(theme.spacing.none)}px;
        `}

    ${({underlayColor, renderStyle = {}}) => {
        const {height, width} = renderStyle;

        return (
            underlayColor &&
            css`
                background-color: ${underlayColor};
                height: ${height}px;
                width: ${width}px;
            `
        );
    }}
`;
