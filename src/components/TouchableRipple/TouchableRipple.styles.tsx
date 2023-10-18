import styled, {css} from 'styled-components/native';

export const Container = styled.Pressable`
    width: 96px;
    height: 96px;
`;

export const Main = styled.View`
    position: relative;
    overflow: hidden;
    flex: 1;

    ${({theme}) => css`
        background-color: ${theme.palette.primary.primary};
    `}
`;
