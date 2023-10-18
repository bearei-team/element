import {GestureResponderEvent} from 'react-native';

export const withAnimationFrame =
    <T extends GestureResponderEvent>(callback: (event: T) => void) =>
    (event: T): void => {
        requestAnimationFrame(() => {
            callback(event);
        });
    };
