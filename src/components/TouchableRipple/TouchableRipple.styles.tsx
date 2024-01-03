import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Pressable)``;

export const Content = styled(Shape)`
    overflow: hidden;
    display: flex;
    flex-direction: row;
    position: relative;
`;
