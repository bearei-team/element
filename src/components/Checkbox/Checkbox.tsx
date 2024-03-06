import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon} from './Checkbox.styles';
import {CheckboxBase, CheckboxProps, RenderProps} from './CheckboxBase';

const render = ({
    disabled,
    eventName,
    icon,
    id,
    onEvent,
    renderStyle,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {height, width} = renderStyle;
    const {onLayout, ...onTouchableRippleEvent} = onEvent;
    const shape = 'full';

    return (
        <Container accessibilityRole="checkbox" testID={`checkbox--${id}`} renderStyle={{width}}>
            <TouchableRipple
                {...onTouchableRippleEvent}
                disabled={disabled}
                shape={shape}
                underlayColor={underlayColor}>
                <Content
                    {...contentProps}
                    onLayout={onLayout}
                    shape={shape}
                    testID={`checkbox__content--${id}`}>
                    <Icon testID={`checkbox__icon--${id}`}>{icon}</Icon>
                    <Hovered
                        eventName={eventName}
                        renderStyle={{width, height}}
                        shape={shape}
                        underlayColor={underlayColor}
                    />
                </Content>
            </TouchableRipple>
        </Container>
    );
};

const ForwardRefCheckbox = forwardRef<View, CheckboxProps>((props, ref) => (
    <CheckboxBase {...props} ref={ref} render={render} />
));

export const Checkbox: FC<CheckboxProps> = memo(ForwardRefCheckbox);
export type {CheckboxProps};
