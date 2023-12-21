import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {
    Animated,
    GestureResponderEvent,
    Modal,
    ModalProps,
    View,
    ViewProps,
} from 'react-native';
import {emitter} from '../../context/ThemeProvider';
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
    PrimaryButton,
    SecondaryButton,
} from './Sheet.styles';
import {RenderProps, SheetBase} from './SheetBase';
export type SheetType = 'side' | 'bottom';

export interface SheetProps
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
    primaryButton?: React.JSX.Element;
    primaryButtonLabelText?: string;
    secondaryButton?: React.JSX.Element;
    secondaryButtonLabelText?: string;
    type?: SheetType;
    visible?: boolean;

    /**
     * horizontalStart' | 'horizontalEnd' only takes effect when the type is 'side', and 'verticalEnd' only takes effect when the type is 'bottom'.
     */
    position?: 'horizontalStart' | 'horizontalEnd' | 'verticalEnd';
}

/**
 * TODO: "bottom"
 *
 * Compatible with macOS, does not use iOS native modal for now. Needs to be implemented in javascript runtime.
 */

const AnimatedContainer = Animated.createAnimatedComponent(Container);
const AnimatedInner = Animated.createAnimatedComponent(Inner);
const ForwardRefSheet = forwardRef<View, SheetProps>((props, ref) => {
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
            primaryButton,
            renderStyle,
            secondaryButton,
            shape,
            visible,
            ...containerProps
        } = renderProps;

        const {backgroundColor, innerTranslateX} = renderStyle;
        const sheet = (
            <>
                {visible && (
                    <Modal onLayout={onShow} testID={`sheet__modal--${id}`}>
                        <AnimatedContainer
                            {...containerProps}
                            ref={ref}
                            style={{backgroundColor}}
                            testID={`sheet--${id}`}>
                            <AnimatedInner
                                shape={shape}
                                style={{
                                    transform: [{translateX: innerTranslateX}],
                                }}
                                testID={`sheet__inner--${id}`}
                                accessibilityRole="alert">
                                <Header testID={`sheet__header--${id}`}>
                                    {back && (
                                        <BackAffordance
                                            testID={`sheet__backAffordance--${id}`}>
                                            {backIcon}
                                        </BackAffordance>
                                    )}

                                    <HeadlineText>{headlineText}</HeadlineText>
                                    <CloseAffordance
                                        testID={`sheet__closeAffordance--${id}`}>
                                        {closeIcon}
                                    </CloseAffordance>
                                </Header>

                                <Content testID={`sheet__content--${id}`}>
                                    {children}
                                </Content>

                                {footer && (
                                    <>
                                        <Divider size="large" />
                                        <Footer testID={`sheet__footer--${id}`}>
                                            <PrimaryButton
                                                testID={`sheet__primaryButton--${id}`}>
                                                {primaryButton}
                                            </PrimaryButton>

                                            <SecondaryButton
                                                testID={`sheet__secondaryButton--${id}`}>
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

        emitter.emit('sheet', sheet);

        return <></>;
    };

    return <SheetBase {...props} render={render} />;
});

export const Sheet: FC<SheetProps> = memo(ForwardRefSheet);
