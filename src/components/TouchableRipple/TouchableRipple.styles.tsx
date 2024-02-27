import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Pressable)`
    align-self: stretch;
    flex: 1;
`;

export const Content = styled(Shape)`
    overflow: hidden;
    position: relative;
`;
