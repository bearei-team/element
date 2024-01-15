export type AnimatedInterpolation = Animated.AnimatedInterpolation<string | number>;
export type BorderStyle = 'dotted' | 'solid' | 'dashed';
export type Layout = 'horizontal' | 'vertical';
export type Size = 'large' | 'medium' | 'small';
export type State =
    | 'enabled'
    | 'focused'
    | 'hovered'
    | 'longPressIn'
    | 'pressIn'
    | 'error'
    | 'disabled';

export type EventName =
    | 'none'
    | 'pressIn'
    | 'press'
    | 'longPress'
    | 'pressOut'
    | 'hoverIn'
    | 'hoverOut'
    | 'focus'
    | 'blur'
    | 'layout';

export type ComponentStatus = 'idle' | 'loading' | 'failed' | 'succeeded';
