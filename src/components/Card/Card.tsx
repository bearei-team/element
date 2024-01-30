import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content} from './Card.styles';
import {CardBase, RenderProps} from './CardBase';

export type CardType = 'elevated' | 'filled' | 'outlined';

export interface CardProps extends TouchableRippleProps {
    subheadTitleText?: string;
    supportingText?: string;
    titleText?: string;
    type?: CardType;
}

const render = ({
    defaultElevation,
    disabled,
    elevation,
    eventName,
    id,
    onEvent,
    underlayColor,
}: RenderProps) => {
    const {...onTouchableRippleEvent} = onEvent;
    const shape = 'medium';

    return (
        <Container testID={`card--${id}`}>
            <Elevation defaultLevel={defaultElevation} level={elevation} shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <Content>
                        <Hovered
                            eventName={eventName}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </Content>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefCard = forwardRef<View, CardProps>((props, ref) => (
    <CardBase {...props} ref={ref} render={render} />
));

export const Card: FC<CardProps> = memo(ForwardRefCard);
