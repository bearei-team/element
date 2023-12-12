import {FC, RefAttributes, forwardRef, memo} from 'react';
import {Animated, Pressable, PressableProps, View, ViewProps} from 'react-native';
import {ShapeProps} from '../../Common/Common.styles';
import {Hovered} from '../../Hovered/Hovered';
import {Container, Header, Icon, IconBackground, LabelText} from './Item.styles';
import {ItemBase, RenderProps} from './ItemBase';

export type PropsBase = Partial<
    ViewProps & RefAttributes<View> & Pick<ShapeProps, 'shape'> & PressableProps
>;
export interface ItemProps extends PropsBase {
    active?: boolean;
    activeIcon?: React.JSX.Element;
    icon?: React.JSX.Element;
    labelText?: string;
    block?: boolean;
}

const AnimatedIconBackground = Animated.createAnimatedComponent(IconBackground);
const AnimatedLabelText = Animated.createAnimatedComponent(LabelText);
const ForwardRefItem = forwardRef<View, ItemProps>((props, ref) => {
    const render = (renderProps: RenderProps) => {
        const {
            active,
            activeIcon,
            icon,
            id,
            labelText,
            onHeaderLayout,
            onLayout,
            pressPosition,
            renderStyle,
            shape,
            state,
            style,
            underlayColor,
            ...containerProps
        } = renderProps;

        const {
            iconBackgroundColor,
            iconBackgroundWidth,
            headerHeight,
            headerWidth,
            labelColor,
            labelHeight,
            flex,
        } = renderStyle;

        return (
            <Pressable {...containerProps} ref={ref} style={{flex}}>
                <Container
                    accessibilityLabel={labelText}
                    accessibilityRole="tab"
                    onLayout={onLayout}
                    style={style}
                    testID={`navigationItem--${id}`}>
                    <Header
                        onLayout={onHeaderLayout}
                        pressPosition={pressPosition}
                        testID={`navigationItem__header--${id}`}>
                        <AnimatedIconBackground
                            shape={shape}
                            style={{
                                backgroundColor: iconBackgroundColor,
                                width: iconBackgroundWidth,
                            }}
                            testID={`navigationItem__iconInner--${id}`}
                        />

                        <Icon testID={`navigationItem__icon--${id}`}>
                            {active ? activeIcon : icon}
                        </Icon>

                        {typeof headerWidth === 'number' && (
                            <Hovered
                                height={headerHeight}
                                shape={shape}
                                state={state}
                                underlayColor={underlayColor}
                                width={headerWidth}
                            />
                        )}
                    </Header>

                    <AnimatedLabelText
                        style={{color: labelColor, height: labelHeight}}
                        testID={`navigationItem__labelText--${id}`}
                        active={active}>
                        {labelText}
                    </AnimatedLabelText>
                </Container>
            </Pressable>
        );
    };

    return <ItemBase {...props} render={render} />;
});

export const Item: FC<ItemProps> = memo(ForwardRefItem);
