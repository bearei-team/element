import {View} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(View)`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) => css`
        background-color: ${theme.palette.surface.surface};
        padding: ${theme.adaptSize(theme.spacing.small)}px ${theme.adaptSize(0)}px;
    `};
`;
