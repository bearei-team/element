import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {Container, Content, Icon, LabelText} from './Chip.styles';
import {ChipBase, RenderProps} from './ChipBase';

export type ChipType = 'input' | 'assist' | 'filter' | 'suggestion' | 'text';
export interface ChipProps extends TouchableRippleProps {
    active?: boolean;
    defaultActive?: boolean;
    elevated?: boolean;
    fill?: string;
    icon?: React.JSX.Element;
    labelText?: string;
    trailingIcon?: React.JSX.Element;
    type?: ChipType;
}

const AnimatedContent = Animated.createAnimatedComponent(Content);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const render = ({
    active,
    activeColor,
    activeLocation,
    defaultActive,
    defaultElevation,
    disabled,
    elevation,
    eventName,
    icon,
    id,
    labelText,
    onEvent,
    renderStyle,
    rippleCentered,
    style,
    trailingIcon,
    type,
    underlayColor,
    ...contentProps
}: RenderProps) => {
    const {backgroundColor, color, height, width, ...border} = renderStyle;
    const shape = 'extraSmall';

    return (
        <Container accessibilityLabel={labelText} testID={`chip--${id}`}>
            <Elevation defaultLevel={defaultElevation} level={elevation} shape={shape}>
                <TouchableRipple
                    {...onEvent}
                    active={active}
                    defaultActive={defaultActive}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={activeColor}
                    centered={rippleCentered}
                    activeLocation={activeLocation}>
                    <AnimatedContent
                        {...contentProps}
                        iconShow={!!icon}
                        trailingIconShow={!!trailingIcon}
                        shape={shape}
                        style={{
                            ...(typeof style === 'object' && style),
                            ...border,
                            backgroundColor,
                        }}
                        testID={`chip__content--${id}`}
                        type={type}>
                        {icon && <Icon testID={`chip__icon--${id}`}>{icon}</Icon>}

                        <AnimatedLabelText
                            ellipsizeMode="tail"
                            numberOfLines={1}
                            size="large"
                            style={{color}}
                            testID={`chip__labelText--${id}`}
                            type="label">
                            {labelText}
                        </AnimatedLabelText>

                        {trailingIcon && (
                            <Icon testID={`chip__trailingIcon--${id}`}>{trailingIcon}</Icon>
                        )}

                        <Hovered
                            eventName={eventName}
                            height={height}
                            shape={shape}
                            underlayColor={underlayColor}
                            width={width}
                        />
                    </AnimatedContent>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefChip = forwardRef<View, ChipProps>((props, ref) => (
    <ChipBase {...props} ref={ref} render={render} />
));

export const Chip: FC<ChipProps> = memo(ForwardRefChip);
