import {css} from 'styled-components';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Shape)`
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    ${({theme}) =>
        css`
            background-color: ${theme.palette.surface.surfaceContainerHigh};
        `};
`;

export const Header = styled.View``;
export const Leading = styled.View``;
export const Content = styled.View``;

export const Trailing = styled(Leading)``;

export const List = styled.View``;
