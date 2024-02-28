import styled, {css} from 'styled-components/native';
import {RenderProps} from './SideSheetBase';

type ContainerProps = Pick<RenderProps, 'visible'>;

export const Container = styled.View<ContainerProps>`
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: 4096;

    ${({theme}) =>
        css`
            left: ${theme.adaptSize(theme.spacing.none)}px;
            top: ${theme.adaptSize(theme.spacing.none)}px;
        `}

    ${({visible, theme}) =>
        !visible &&
        css`
            height: ${theme.adaptSize(theme.spacing.none)}px;
            overflow: hidden;
            pointer-events: none;
            z-index: -4096;
        `}
`;
