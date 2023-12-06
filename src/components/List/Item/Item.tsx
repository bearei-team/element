import {FC, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {Hovered} from '../../Hovered/Hovered';
import {TouchableRipple, TouchableRippleProps} from '../../TouchableRipple/TouchableRipple';
import {Container, Content, Headline, Leading, Main, SupportingText, Trailing} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export interface ItemProps extends TouchableRippleProps {
    headline?: string;
    trailing?: React.JSX.Element;
    supportingText?: string;
    leading?: React.JSX.Element;
}

const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            headline,
            id,
            leading,
            renderStyle,
            state,
            supportingText,
            trailing,
            underlayColor,
            ...touchableRippleProps
        } = renderProps;

        const {touchableRippleHeight, touchableRippleWidth} = renderStyle;

        return (
            <Container
                accessibilityLabel={headline}
                accessibilityRole="list"
                testID={`listItem--${id}`}>
                <TouchableRipple {...touchableRippleProps} ref={ref} underlayColor={underlayColor}>
                    <Main testID={`listItem__main--${id}`}>
                        {leading && (
                            <Leading testID={`listItem__leading--${id}`}>{leading}</Leading>
                        )}

                        <Content>
                            <Headline testID={`listItem__headline--${id}`}>{headline}</Headline>
                            {supportingText && (
                                <SupportingText testID={`listItem__supportingText--${id}`}>
                                    {supportingText}
                                </SupportingText>
                            )}
                        </Content>

                        {trailing && (
                            <Trailing testID={`listItem__trailing--${id}`}>{trailing}</Trailing>
                        )}
                    </Main>

                    <Hovered
                        height={touchableRippleHeight}
                        state={state}
                        underlayColor={underlayColor}
                        width={touchableRippleWidth}
                    />
                </TouchableRipple>
            </Container>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
