import {View} from 'react-native';
import {css} from 'styled-components';
import styled from 'styled-components/native';

export const Container = styled(View)`
    align-self: stretch;

    ${({theme}) =>
        css`
            height: ${theme.adaptSize(theme.spacing.small * 7)}px;
        `};
`;
