import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './UnderlayBase';

interface ContainerProps extends Pick<RenderProps, 'underlayColor'> {
    renderStyle?: {height?: number; width?: number};
}

export const Container = styled(Shape)<ContainerProps>`
    pointer-events: none;
    position: absolute;
    z-index: -1;

    ${({theme}) =>
        css`
            bottom: ${theme.adaptSize(theme.spacing.none)}px;
            left: ${theme.adaptSize(theme.spacing.none)}px;
            right: ${theme.adaptSize(theme.spacing.none)}px;
            top: ${theme.adaptSize(theme.spacing.none)}px;
        `}

    ${({underlayColor}) =>
        underlayColor &&
        css`
            background-color: ${underlayColor};
        `}

    ${({renderStyle = {}}) => {
        const {height = 0, width = 0} = renderStyle;

        return (
            width !== 0 &&
            css`
                height: ${height}px;
                width: ${width}px;
            `
        );
    }}
`;
