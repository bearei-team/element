import {FlatList} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(FlatList)`
    flex: 1;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
        padding: ${theme.adaptSize(theme.spacing.small)}px ${theme.adaptSize(theme.spacing.none)}px;
    `};
`;
