// import {Shape} from '@bearei/theme';
// import {FC, memo, useEffect} from 'react';
// import {View, ViewProps} from 'react-native';
// import {Container, Shadow0, Shadow1} from './Elevation.styles';
// import {BaseElevation, RenderProps} from './BaseElevation';
// import {Animated} from 'react-native';
// import {useAnimatedValue} from '../../hooks/useAnimatedValue';

// export interface ElevationProps extends ViewProps {
//     level?: 0 | 1 | 2 | 3 | 4 | 5;
//     shape?: keyof Shape;
// }

// export const Elevation: FC<ElevationProps> = memo((props): React.JSX.Element => {
//     const [widthAnimated] = useAnimatedValue(0);
//     const widthAd = widthAnimated.interpolate({
//         inputRange: [0, 1],
//         outputRange: [1, 100],
//     });

//     const render = ({
//         id,
//         children,
//         level,
//         shadowStyle,
//         shape,

//         ...args
//     }: RenderProps): React.JSX.Element => {
//         const {opacity0, opacity1, offset0, offset1, ...styles} = shadowStyle;

//         return (
//             <Shadow0
//                 {...args}
//                 style={{
//                     // ...styles,
//                     width: 120,
//                     height: 40,
//                     backgroundColor: 'red',
//                     shadowColor: 'black',
//                     shadowOffset: {width: widthAd, height: 10},
//                     // shadowOpacity: 1,
//                     // shadowRadius: 3,
//                 }}
//                 testID={`elevation--${id}`}>
//                 {children}
//                 {/* {styles.width !== 0 && (
//                     <Shadow0
//                         testID={`elevation__shadow0--${id}`}
//                         shape={shape}
//                         level={level}
//                         style={{
//                             ...styles,
//                             shadowColor: '#000000',
//                             shadowOffset: {width: 4, height: 14},
//                             shadowOpacity: 0.15,
//                         }}
//                     />
//                 )} */}

//                 {/* <View
//                     testID={`elevation__shadow0--${id}`}
//                     // shape={shape}
//                     // level={level}
//                     style={{
//                         // ...styles,
//                         shadowColor: 'black',
//                         shadowOffset: {width: 10, height: 10},
//                         shadowOpacity: 1,
//                         shadowRadius: 3,
//                     }}
//                 /> */}

//                 {/* {styles.width !== 0 && (
//                     <Shadow1
//                         testID={`elevation__shadow1--${id}`}
//                         shape={shape}
//                         level={level}
//                         // eslint-disable-next-line react-native/no-inline-styles
//                         style={{
//                             ...styles,
//                             shadowOffset: {
//                                 width: 1,
//                                 height: 1,
//                             },
//                         }}
//                     />
//                 )} */}
//             </Shadow0>
//         );
//     };

//     useEffect(() => {
//         Animated.timing(widthAnimated, {
//             toValue: 1,
//             duration: 300,
//             useNativeDriver: false,
//         }).start(() =>
//             setTimeout(() => {
//                 // Animated.timing(widthAnimated, {
//                 //     toValue: 0,
//                 //     duration: 300,
//                 //     useNativeDriver: false,
//                 // }).start();
//             }, 3000),
//         );
//     }, [widthAnimated]);

//     return <BaseElevation {...props} render={render} />;
// });
