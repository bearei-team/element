import React, {FC, forwardRef, memo} from 'react'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {Divider} from '../../Divider/Divider'
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
    SecondaryButton
} from './Sheet.styles'
import {RenderProps, SheetBase, SheetProps} from './SheetBase'

const AnimatedContainer = Animated.createAnimatedComponent(Container)
const AnimatedInner = Animated.createAnimatedComponent(Inner)
const render = ({
    back,
    backIcon,
    closeIcon,
    content,
    footer,
    headlineText,
    id,
    sheetPosition,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    type,
    ...innerProps
}: RenderProps) => {
    const {innerAnimatedStyle, contentAnimatedStyle} = renderStyle
    const shape =
        sheetPosition === 'horizontalStart' ? 'largeEnd' : 'largeStart'

    return (
        <AnimatedContainer
            sheetPosition={sheetPosition}
            style={[contentAnimatedStyle]}
            testID={`sideSheet--${id}`}
            type={type}
        >
            <AnimatedInner
                {...innerProps}
                accessibilityRole='alert'
                shape={shape}
                sheetPosition={sheetPosition}
                style={[style, innerAnimatedStyle]}
                testID={`sideSheet__inner--${id}`}
                type={type}
            >
                <Header testID={`sideSheet__header--${id}`}>
                    {back && (
                        <BackAffordance
                            testID={`sideSheet__backAffordance--${id}`}
                        >
                            {backIcon}
                        </BackAffordance>
                    )}

                    <HeadlineText
                        size='large'
                        type='title'
                    >
                        {headlineText}
                    </HeadlineText>

                    <CloseAffordance
                        testID={`sideSheet__closeAffordance--${id}`}
                    >
                        {closeIcon}
                    </CloseAffordance>
                </Header>

                <Content testID={`sideSheet__content--${id}`}>
                    {content}
                </Content>

                {footer && (
                    <>
                        <Divider
                            block={true}
                            size='large'
                        />

                        <Footer testID={`sideSheet__footer--${id}`}>
                            <PrimaryButton
                                testID={`sideSheet__primaryButton--${id}`}
                            >
                                {primaryButton}
                            </PrimaryButton>

                            <SecondaryButton
                                testID={`sideSheet__secondaryButton--${id}`}
                            >
                                {secondaryButton}
                            </SecondaryButton>
                        </Footer>
                    </>
                )}
            </AnimatedInner>
        </AnimatedContainer>
    )
}

const ForwardRefSheet = forwardRef<View, SheetProps>((props, ref) => (
    <SheetBase
        {...props}
        ref={ref}
        render={render}
    />
))

export const Sheet: FC<SheetProps> = memo(ForwardRefSheet)
export type {SheetProps}
