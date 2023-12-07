import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    display: flex;

    ${({theme}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainer};
            gap: ${theme.adaptSize(theme.spacing.small)}px;
        `};
`;
