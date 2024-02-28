import {Pressable} from 'react-native';
import styled, {css} from 'styled-components/native';

interface ContainerProps {
    renderStyle: {height?: number; width?: number};
}

export const Container = styled(Pressable)<ContainerProps>`
    ${({renderStyle}) => {
        const {width = 0, height = 0} = renderStyle;

        return css`
            height: ${height}px;
            width: ${width}px;
        `;
    }}
`;
