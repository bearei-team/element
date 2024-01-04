import {Pressable} from 'react-native';
import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

export const Container = styled(Pressable)``;
export const Content = styled(Shape)`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: center;
    overflow: hidden;
    position: relative;
`;
