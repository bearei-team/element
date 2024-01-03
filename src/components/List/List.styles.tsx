import {View} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(View)`
    flex: 1;
    width: 100%;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
        padding: ${theme.adaptSize(theme.spacing.small)}px
            ${theme.adaptSize(theme.spacing.none)}px;
    `};
`;

export const Content = styled.FlatList``;
