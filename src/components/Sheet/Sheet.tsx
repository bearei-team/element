import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {Modal, View, ViewProps} from 'react-native';
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

export interface SheetProps extends Partial<ViewProps & RefAttributes<View>> {
    backIcon?: React.JSX.Element;
    closeIcon?: React.JSX.Element;
    footer?: boolean;
    headlineText?: string;
    onBack?: () => void;
    onClose?: () => void;
    onPrimaryButtonPr?: () => void;
    onSecondaryButtonPr?: () => void;
    primaryButton?: React.JSX.Element;
    secondaryButton?: React.JSX.Element;
    type?: SheetType;
    visible?: boolean;
}

/**
 * TODO: "bottom"
 */
const ForwardRefSheet = forwardRef<View, SheetProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            id,
            primaryButton,
            secondaryButton,
            footer,
            backIcon,
            closeIcon,
            children,
            headlineText,
            ...containerProps
        } = renderProps;

        return (
            <Modal
                animationType="none"
                presentationStyle="overFullScreen"
                transparent={true}
                testID={`sheet__modal--${id}`}>
                <Container {...containerProps} ref={ref} shape="full" testID={`sheet--${id}`}>
                    <Inner testID={`sheet__inner--${id}`}>
                        <Header testID={`sheet__header--${id}`}>
                            {backIcon && (
                                <BackAffordance testID={`sheet__backAffordance--${id}`}>
                                    {backIcon}
                                </BackAffordance>
                            )}

                            <HeadlineText>{headlineText}</HeadlineText>

                            {closeIcon && (
                                <CloseAffordance testID={`sheet__closeAffordance--${id}`}>
                                    {closeIcon}
                                </CloseAffordance>
                            )}
                        </Header>

                        <Content testID={`sheet__content--${id}`}>{children}</Content>

                        {footer && (
                            <Footer testID={`sheet__footer--${id}`}>
                                <PrimaryButton testID={`sheet__primaryButton--${id}`}>
                                    {primaryButton}
                                </PrimaryButton>

                                <SecondaryButton testID={`sheet__secondaryButton--${id}`}>
                                    {secondaryButton}
                                </SecondaryButton>
                            </Footer>
                        )}
                    </Inner>
                </Container>
            </Modal>
        );
    };

    return <SheetBase {...props} render={render} />;
});

export const Sheet: FC<SheetProps> = memo(ForwardRefSheet);
