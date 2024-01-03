import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Pressable)``;

export const Content = styled(Shape)`
    display: flex;
    flex-direction: row;
    overflow: hidden;
    position: relative;
`;
