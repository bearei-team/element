import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    ModalProps,
    View,
    ViewProps,
} from 'react-native';
import {ShapeProps} from '../Common/Common.styles';
import {Divider} from '../Divider/Divider';
import {
    BackAffordance,
    CloseAffordance,
    Container,
    Content,
    Footer,
    Header,
    HeadlineText,
    Inner,
    Modal,
    PrimaryButton,
    SecondaryButton,
} from './SideSheet.styles';
import {RenderProps, SideSheetBase} from './SideSheetBase';
export type SideSheetType = 'side' | 'bottom';

export interface SideSheetProps
    extends Partial<
        ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps
    > {
    back?: boolean;
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    footer?: boolean;
    headlineText?: string;
    onBack?: (event: GestureResponderEvent) => void;
    onClose?: (event: GestureResponderEvent) => void;
    onPrimaryButtonPress?: (event: GestureResponderEvent) => void;
    onSecondaryButtonPress?: (event: GestureResponderEvent) => void;
    position?: 'horizontalStart' | 'horizontalEnd';
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    type?: SideSheetType;
    visible?: boolean;
}

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const ForwardRefSideSheet = forwardRef<View, SideSheetProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            back,
            backIcon,
            children,
            closeIcon,
            footer,
            headlineText,
            id,
            onShow,
            position,
            primaryButton,
            renderStyle,
            secondaryButton,
            visible,
            style,
            ...innerProps
        } = renderProps;

        const {backgroundColor, innerTranslateX} = renderStyle;
        const shape =
            position === 'horizontalStart' ? 'largeEnd' : 'largeStart';

        return (
            <>
                {visible && (
                    <Modal onLayout={onShow} testID={`sideSheet__modal--${id}`}>
                        <AnimatedContainer
                            style={{backgroundColor}}
                            testID={`sideSheet--${id}`}>
                            <AnimatedInner
                                {...innerProps}
                                shape={shape}
                                style={{
                                    ...(typeof style === 'object' && style),
                                    transform: [{translateX: innerTranslateX}],
                                }}
                                testID={`sideSheet__inner--${id}`}
                                accessibilityRole="alert">
                                <Header testID={`sideSheet__header--${id}`}>
                                    {back && (
                                        <BackAffordance
                                            testID={`sideSheet__backAffordance--${id}`}>
                                            {backIcon}
                                        </BackAffordance>
                                    )}

                                    <HeadlineText size="large" type="title">
                                        {headlineText}
                                    </HeadlineText>

                                    <CloseAffordance
                                        testID={`sideSheet__closeAffordance--${id}`}>
                                        {closeIcon}
                                    </CloseAffordance>
                                </Header>

                                <Content
                                    testID={`sideSheet__content--${id}`}
                                    showsVerticalScrollIndicator={false}>
                                    {children}
                                </Content>

                                {footer && (
                                    <>
                                        <Divider size="large" />
                                        <Footer
                                            testID={`sideSheet__footer--${id}`}>
                                            <PrimaryButton
                                                testID={`sideSheet__primaryButton--${id}`}>
                                                {primaryButton}
                                            </PrimaryButton>

                                            <SecondaryButton
                                                testID={`sideSheet__secondaryButton--${id}`}>
                                                {secondaryButton}
                                            </SecondaryButton>
                                        </Footer>
                                    </>
                                )}
                            </AnimatedInner>
                        </AnimatedContainer>
                    </Modal>
                )}
            </>
        );
    };

    return <SideSheetBase {...props} ref={ref} render={render} />;
});

export const SideSheet: FC<SideSheetProps> = memo(ForwardRefSideSheet);
