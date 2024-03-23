import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {RenderProps} from './IconButtonBase';

type ContentProps = Pick<RenderProps, 'renderStyle'>;

export const Container = styled(View)<ContentProps>`
    align-items: center;
    cursor: default;
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: relative;

    ${({renderStyle = {}, theme}) => {
        const {height, width} = renderStyle;

        return css`
            height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
        `;
    }};
`;

export const Content = styled.View<ContentProps>`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    pointer-events: none;
    position: relative;
    z-index: 1;

    ${({renderStyle = {}, theme}) => {
        const {height, width} = renderStyle;

        return css`
            height: ${height ?? theme.adaptSize(theme.spacing.small * 5)}px;
            width: ${width ?? theme.adaptSize(theme.spacing.small * 5)}px;
        `;
    }};
`;
