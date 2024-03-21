import {View} from 'react-native';
import styled, {css} from 'styled-components/native';
import {Shape} from '../Common/Common.styles';
import {RenderProps} from './IconButtonBase';

type ContentProps = Pick<RenderProps, 'renderStyle'>;

export const Container = styled(View)`
    cursor: default;
    overflow: hidden;

    ${({theme}) =>
        theme.OS === 'web' &&
        css`
            display: inline-block;
        `}
`;

export const Content = styled(Shape)<ContentProps>`
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
