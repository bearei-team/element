import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon} from './Checkbox.styles';
import {CheckboxBase, RenderProps} from './CheckboxBase';

export type CheckboxType = 'selected' | 'indeterminate' | 'unselected';

export interface CheckboxProps extends TouchableRippleProps {
    defaultActive?: boolean;
    disabled?: boolean;
    error?: boolean;
    height?: number;
    indeterminate?: boolean;
    type?: CheckboxType;
    width?: number;
    onActive?: (active?: boolean) => void;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const render = ({
    eventName,
    icon,
    id,
    onEvent,
    renderStyle,
    underlayColor,
    disabled,
    ...contentProps
}: RenderProps) => {
    const {height, width} = renderStyle;
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const shape = 'full';

    return (
        <Container accessibilityRole="checkbox" testID={`checkbox--${id}`}>
            <TouchableRipple
                {...onTouchableRippleEvent}
                disabled={disabled}
                shape={shape}
                underlayColor={underlayColor}>
                <AnimatedContent
                    {...contentProps}
                    onLayout={onLayout}
                    shape={shape}
                    testID={`checkbox__content--${id}`}>
                    <Icon testID={`checkbox__icon--${id}`}>{icon}</Icon>
                    <Hovered
                        eventName={eventName}
                        height={height}
                        shape={shape}
                        underlayColor={underlayColor}
                        width={width}
                    />
                </AnimatedContent>
            </TouchableRipple>
        </Container>
    );
};

const ForwardRefCheckbox = forwardRef<View, CheckboxProps>((props, ref) => (
    <CheckboxBase {...props} ref={ref} render={render} />
));

export const Checkbox: FC<CheckboxProps> = memo(ForwardRefCheckbox);
