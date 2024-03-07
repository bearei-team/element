import {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Elevation} from '../Elevation/Elevation';
import {Hovered} from '../Hovered/Hovered';
import {TouchableRipple} from '../TouchableRipple/TouchableRipple';
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
import {CardBase, CardProps, RenderProps} from './CardBase';

const AnimatedSupportingText = Animated.createAnimatedComponent(SupportingText);
const AnimatedSubheadText = Animated.createAnimatedComponent(SubheadText);
const AnimatedTitleText = Animated.createAnimatedComponent(TitleText);
const render = ({
    block,
    disabled,
    elevation,
    eventName,
    footer,
    id,
    onEvent,
    onInnerLayout,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    subheadText,
    supportingText,
    titleText,
    underlayColor,
}: RenderProps) => {
    const {
        backgroundColor,
        height,
        innerHeight,
        innerWidth,
        subColor,
        titleColor,
        width,
        ...border
    } = renderStyle;

    const shape = 'medium';
    const hoveredLayout = {height: height || innerHeight, width: width || innerWidth};
    const {onLayout, ...onTouchableRippleEvent} = onEvent;

    return (
        <Container
            block={block}
            onLayout={onLayout}
            renderStyle={{width: innerWidth}}
            testID={`card--${id}`}>
            <Elevation level={elevation} shape={shape}>
                <TouchableRipple
                    {...onTouchableRippleEvent}
                    disabled={disabled}
                    shape={shape}
                    underlayColor={underlayColor}
                    style={{
                        ...(typeof style === 'object' && style),
                        ...border,
                        backgroundColor,
                    }}>
                    <Inner
                        shape={shape}
                        onLayout={onInnerLayout}
                        testID={`card__inner--${id}`}
                        block={block}
                        renderStyle={{width}}>
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
                            renderStyle={{width: hoveredLayout.width, height: hoveredLayout.height}}
                            shape={shape}
                            underlayColor={underlayColor}
                        />
                    </Inner>
                </TouchableRipple>
            </Elevation>
        </Container>
    );
};

const ForwardRefCard = forwardRef<View, CardProps>((props, ref) => (
    <CardBase {...props} ref={ref} render={render} />
));

export const Card: FC<CardProps> = memo(ForwardRefCard);
export type {CardProps};
