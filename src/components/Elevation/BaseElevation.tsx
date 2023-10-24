// import {FC, useCallback, useEffect, useId} from 'react';
// import {ElevationProps} from './Elevation';
// import {useAnimatedValue} from '../../hooks/useAnimatedValue';
// import {UTIL} from '../../utils/util';
// import {useTheme} from 'styled-components/native';
// import {LayoutChangeEvent, LayoutRectangle} from 'react-native';
// import {useImmer} from 'use-immer';

// export type RenderProps = ElevationProps & {
//     shadowStyle: {
//         width: number;
//         height: number;
//     };
// };

// export interface BaseElevationProps extends ElevationProps {
//     render: (props: RenderProps) => React.JSX.Element;
// }

// export const BaseElevation: FC<BaseElevationProps> = ({
//     render,
//     level = 3,
//     onLayout,
//     ...args
// }): React.JSX.Element => {
//     const id = useId();
//     const theme = useTheme();
//     const [layout, setLayout] = useImmer({width: 0, height: 0} as LayoutRectangle);

//     // const processAnimatedTiming = useCallback(
//     //     (toLevel: number, finished?: () => void): void => {
//     //         const animatedTiming = UTIL.animatedTiming(theme);
//     //         const runAnimated = (): number =>
//     //             requestAnimationFrame(() => {
//     //                 // animatedTiming(shadow0Animated, {
//     //                 //     toValue: toLevel,
//     //                 //     easing: 'standardDecelerate',
//     //                 //     duration: 'medium1',
//     //                 // }).start();

//     //                 // animatedTiming(shadow1Animated, {
//     //                 //     toValue: toLevel,
//     //                 //     easing: 'standardDecelerate',
//     //                 //     duration: 'medium1',
//     //                 // }).start(finished);

//     //                 console.info(666666);
//     //                 animatedTiming(offsetX0Animated, {
//     //                     toValue: 1,
//     //                     easing: 'standardDecelerate',
//     //                     duration: 'medium1',
//     //                 }).start();

//     //                 // animatedTiming(offsetY0Animated, {
//     //                 //     toValue: 1,
//     //                 //     easing: 'standardDecelerate',
//     //                 //     duration: 'medium1',
//     //                 // }).start(finished);

//     //                 // animatedTiming(offsetX1Animated, {
//     //                 //     toValue: 1,
//     //                 //     easing: 'standardDecelerate',
//     //                 //     duration: 'medium1',
//     //                 // }).start();

//     //                 // animatedTiming(offsetY1Animated, {
//     //                 //     toValue: 1,
//     //                 //     easing: 'standardDecelerate',
//     //                 //     duration: 'medium1',
//     //                 // }).start(finished);
//     //             });

//     //         runAnimated();
//     //     },
//     //     [offsetX0Animated, theme],
//     // );

//     const processLayout = (event: LayoutChangeEvent): void => {
//         onLayout?.(event);
//         setLayout(() => event.nativeEvent.layout);
//     };

//     const elevation = render({
//         ...args,
//         id,
//         level,
//         shadowStyle: {
//             width: layout.width,
//             height: layout.height,
//         },
//         onLayout: processLayout,
//     });

//     // useEffect(() => {
//     //     processAnimatedTiming(level);
//     // }, [level, processAnimatedTiming]);

//     return elevation;
// };
