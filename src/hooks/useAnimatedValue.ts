import {Animated} from 'react-native';
import {useLazyRef} from './useLazyRef';

export const useAnimatedValue = (value: number) => {
    const [animatedValueRef] = useLazyRef(() => new Animated.Value(value));

    return [animatedValueRef.current];
};
