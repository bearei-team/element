import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';

import {Underlay} from '../Underlay/Underlay';
import {Container, Content, Icon} from './Checkbox.styles';
import {CheckboxBase, CheckboxProps, RenderProps} from './CheckboxBase';

const render = ({
    disabled,
    eventName,
    icon,
    id,
    onEvent,

    underlayColor,
    ...contentProps
}: RenderProps) => (
    <Container accessibilityRole="checkbox" testID={`checkbox--${id}`}>
        <TouchableRipple
            {...onEvent}
            disabled={disabled}
            shape="full"
            underlayColor={underlayColor}>
            <Content {...contentProps} testID={`checkbox__content--${id}`}>
                <Icon testID={`checkbox__icon--${id}`}>{icon}</Icon>
                <Underlay eventName={eventName} underlayColor={underlayColor} />
            </Content>
        </TouchableRipple>
    </Container>
);

const ForwardRefCheckbox = forwardRef<View, CheckboxProps>((props, ref) => (
    <CheckboxBase {...props} ref={ref} render={render} />
));

export const Checkbox: FC<CheckboxProps> = memo(ForwardRefCheckbox);
export type {CheckboxProps};
