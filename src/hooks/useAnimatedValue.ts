import {Animated} from 'react-native';
import {useLazyRef} from './useLazyRef';

export const useAnimatedValue = (value: number): Animated.Value[] => {
    const {current} = useLazyRef(() => new Animated.Value(value));

    return [current];
};
