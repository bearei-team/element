import {View} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(View)`
    flex: 1;
    align-self: stretch;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
    `};
`;

export const Content = styled.FlatList``;
