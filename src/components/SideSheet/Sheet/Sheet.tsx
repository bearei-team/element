import React, {FC, forwardRef, memo} from 'react';
import {Animated, View} from 'react-native';
import {Divider} from '../../Divider/Divider';
import {
    BackAffordance,
    CloseAffordance,
    Container,
    Content,
    Footer,
    Header,
    HeadlineText,
    Inner,
    PrimaryButton,
    SecondaryButton,
} from './Sheet.styles';
import {RenderProps, SheetBase, SheetProps} from './SheetBase';

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const render = ({
    back,
    backIcon,
    closeIcon,
    content,
    footer,
    headlineText,
    id,
    position,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    destroy,
    ...innerProps
}: RenderProps) => {
    const {backgroundColor, innerTranslateX} = renderStyle;
    const shape = position === 'horizontalStart' ? 'largeEnd' : 'largeStart';

    return (
        <AnimatedContainer style={{backgroundColor}} testID={`sideSheet--${id}`}>
            <AnimatedInner
                {...innerProps}
                shape={shape}
                style={{
                    ...(typeof style === 'object' && style),
                    transform: [{translateX: innerTranslateX}],
                }}
                testID={`sideSheet__inner--${id}`}
                accessibilityRole="alert">
                {destroy ? (
                    <></>
                ) : (
                    <>
                        <Header testID={`sideSheet__header--${id}`}>
                            {back && (
                                <BackAffordance testID={`sideSheet__backAffordance--${id}`}>
                                    {backIcon}
                                </BackAffordance>
                            )}

                            <HeadlineText size="large" type="title">
                                {headlineText}
                            </HeadlineText>

                            <CloseAffordance testID={`sideSheet__closeAffordance--${id}`}>
                                {closeIcon}
                            </CloseAffordance>
                        </Header>

                        <Content testID={`sideSheet__content--${id}`}>{content}</Content>

                        {footer && (
                            <>
                                <Divider size="large" block={true} />
                                <Footer testID={`sideSheet__footer--${id}`}>
                                    <PrimaryButton testID={`sideSheet__primaryButton--${id}`}>
                                        {primaryButton}
                                    </PrimaryButton>

                                    <SecondaryButton testID={`sideSheet__secondaryButton--${id}`}>
                                        {secondaryButton}
                                    </SecondaryButton>
                                </Footer>
                            </>
                        )}
                    </>
                )}
            </AnimatedInner>
        </AnimatedContainer>
    );
};

const ForwardRefSheet = forwardRef<View, SheetProps>((props, ref) => (
    <SheetBase {...props} ref={ref} render={render} />
));

export const Sheet: FC<SheetProps> = memo(ForwardRefSheet);
export type {SheetProps};
