import styled from 'styled-components/native';
import {Shape} from '../Common/Common.styles';

const Container = styled.Pressable`
    display: inline-block;
`;

const Main = styled(Shape)`
    overflow: hidden;
    position: relative;
`;

export {Container, Main};
