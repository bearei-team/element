import {View} from 'react-native';
import styled, {css} from 'styled-components/native';

export const Container = styled(View)`
    display: flex;
    flex-direction: column;

    ${({theme}) =>
        css`
            gap: ${theme.adaptSize(theme.spacing.extraSmall)}px;
        `}
`;
