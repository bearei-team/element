import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, GestureResponderEvent, ModalProps, View, ViewProps} from 'react-native';
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
    extends Partial<ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & ModalProps> {
    back?: boolean;
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    content?: React.JSX.Element;
    footer?: boolean;
    headlineText?: string;
    onBack?: () => void;
    onClose?: () => void;
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

const render = ({
    back,
    backIcon,
    content,
    closeIcon,
    footer,
    headlineText,
    id,
    onShow,
    position,
    primaryButton,
    renderStyle,
    secondaryButton,
    style,
    visible,
    ...innerProps
}: RenderProps) => {
    const AnimatedContainer = Animated.createAnimatedComponent(Container);
    const AnimatedInner = Animated.createAnimatedComponent(Inner);
    const {backgroundColor, innerTranslateX} = renderStyle;
    const shape = position === 'horizontalStart' ? 'largeEnd' : 'largeStart';

    return (
        <>
            {visible && (
                <Modal
                    key={`sideSheet__modal--${id}`}
                    onLayout={onShow}
                    testID={`sideSheet__modal--${id}`}>
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
                                    <Divider size="large" />
                                    <Footer testID={`sideSheet__footer--${id}`}>
                                        <PrimaryButton testID={`sideSheet__primaryButton--${id}`}>
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

const ForwardRefSideSheet = forwardRef<View, SideSheetProps>((props, ref) => (
    <SideSheetBase {...props} ref={ref} render={render} />
));

export const SideSheet: FC<SideSheetProps> = memo(ForwardRefSideSheet);
