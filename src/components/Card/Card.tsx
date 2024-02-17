import {FC, forwardRef, memo} from 'react';
import {Animated, GestureResponderEvent, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../TouchableRipple/TouchableRipple';
import {
    Container,
    Content,
    ContentFooter,
    ContentHeader,
    Inner,
    PrimaryButton,
    SecondaryButton,
    SubheadText,
    SupportingText,
    TitleText,
} from './Card.styles';
import {CardBase, RenderProps} from './CardBase';

export type CardType = 'elevated' | 'filled' | 'outlined';
export interface CardProps extends TouchableRippleProps {
    block?: boolean;
    footer?: boolean;
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void;
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void;
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    subheadText?: string;
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
    footer,
    id,
    onEvent,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    subheadText,
    supportingText,
    titleText,
    underlayColor,
    onInnerLayout,
    block,
}: RenderProps) => {
    const AnimatedInner = Animated.createAnimatedComponent(Inner);
    const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
    const AnimatedSubheadText = Animated.createAnimatedComponent(SubheadText);
    const AnimatedTitleText = Animated.createAnimatedComponent(TitleText);
    const {
        width,
        height,
        backgroundColor,
        titleColor,
        subColor,
        innerHeight,
        innerWidth,
        ...border
    } = renderStyle;

    const shape = 'medium';
    const hoveredLayout = {height: height || innerHeight, width: width || innerWidth};
    const {onLayout, ...onTouchableRippleEvent} = onEvent;

    return (
        <Container testID={`card--${id}`} block={block} width={innerWidth} onLayout={onLayout}>
            <Elevation defaultLevel={defaultElevation} level={elevation} shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}>
                    <AnimatedInner
                        shape={shape}
                        onLayout={onInnerLayout}
                        style={{
                            ...(typeof style === 'object' && style),
                            ...border,
                            backgroundColor,
                        }}
                        testID={`card__inner--${id}`}
                        block={block}
                        width={width}>
                        <Content testID={`card__content--${id}`}>
                            <ContentHeader testID={`card__contentHeader--${id}`}>
                                {titleText && (
                                    <AnimatedTitleText
                                        style={{color: titleColor}}
                                        type="body"
                                        size="large"
                                        testID={`card__titleText--${id}`}>
                                        {titleText}
                                    </AnimatedTitleText>
                                )}

                                {subheadText && (
                                    <AnimatedSubheadText
                                        style={{color: subColor}}
                                        type="body"
                                        size="medium"
                                        testID={`card__subheadText--${id}`}>
                                        {subheadText}
                                    </AnimatedSubheadText>
                                )}
                            </ContentHeader>

                            {supportingText && (
                                <AnimatedSupportingText
                                    style={{color: subColor}}
                                    type="body"
                                    size="medium"
                                    testID={`card__supportingText--${id}`}>
                                    {supportingText}
                                </AnimatedSupportingText>
                            )}

                            {footer && (
                                <ContentFooter testID={`card__contentFooter--${id}`}>
                                    <SecondaryButton testID={`card__secondaryButton--${id}`}>
                                        {secondaryButton}
                                    </SecondaryButton>

                                    <PrimaryButton testID={`card__primaryButton--${id}`}>
                                        {primaryButton}
                                    </PrimaryButton>
                                </ContentFooter>
                            )}
                        </Content>

                        <Hovered
                            eventName={eventName}
                            height={hoveredLayout.height}
                            shape={shape}
                            underlayColor={underlayColor}
                            width={hoveredLayout.width}
                        />
                    </AnimatedInner>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefCard = forwardRef<View, CardProps>((props, ref) => (
    <CardBase {...props} ref={ref} render={render} />
));

export const Card: FC<CardProps> = memo(ForwardRefCard);
