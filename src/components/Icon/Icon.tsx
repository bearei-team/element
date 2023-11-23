import React, {FC, RefAttributes, forwardRef, memo} from 'react';
import {View} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {BaseIcon, RenderProps} from './BaseIcon';
import {Container} from './Icon.styles';

export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone';
export interface IconProps
    extends Partial<Omit<SvgProps, 'width' | 'height'> & RefAttributes<View>> {
    type?: IconType;
    icon?: string;
    width?: number;
    height?: number;
}

const ForwardRefIcon = forwardRef<View, IconProps>((props, ref) => {
    const render = ({id, SvgIcon, renderStyle, style, ...iconProps}: RenderProps) => {
        const {height, width} = renderStyle;

        return (
            <Container height={height} ref={ref} testID={`icon--${id}`} width={width} style={style}>
                {SvgIcon && (
                    <SvgIcon
                        {...iconProps}
                        height="100%"
                        testID={`icon__svg--${id}`}
                        viewBox="0 0 24 24"
                        width="100%"
                    />
                )}
            </Container>
        );
    };

    return <BaseIcon {...props} render={render} />;
});

export const Icon: FC<IconProps> = memo(ForwardRefIcon);
