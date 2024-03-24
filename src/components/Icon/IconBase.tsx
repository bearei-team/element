import {RefAttributes, forwardRef, useId} from 'react'
import {View, ViewProps, ViewStyle} from 'react-native'
import {AnimatedStyle} from 'react-native-reanimated'
import {SvgProps} from 'react-native-svg'
import {useTheme} from 'styled-components/native'
import {EventName} from '../Common/interface'
import {filled} from './icons/filled'
import {icon} from './icons/icon'
import {useAnimated} from './useAnimated'

export type IconName = keyof (typeof filled)['svg']
export type IconType = 'filled' | 'outlined' | 'round' | 'sharp' | 'twoTone'
type BaseProps = Partial<
    Omit<SvgProps, 'width' | 'height'> & RefAttributes<View> & ViewProps
>
export interface IconProps extends BaseProps {
    eventName?: EventName
    name?: IconName
    renderStyle?: {width?: number; height?: number}
    type?: IconType
}

export interface RenderProps extends IconProps {
    renderStyle: {
        animatedStyle: AnimatedStyle<ViewStyle>
        height?: number
        width?: number
    }
}

interface IconBaseProps extends IconProps {
    render: (props: RenderProps) => React.JSX.Element
}

export const IconBase = forwardRef<View, IconBaseProps>(
    (
        {
            eventName,
            fill,
            name = 'circle',
            render,
            renderStyle,
            type = 'outlined',
            ...renderProps
        },
        ref
    ) => {
        const id = useId()
        const SvgIcon = icon?.[type]?.svg?.[name]
        const theme = useTheme()
        const [{animatedStyle}] = useAnimated({eventName})

        return render({
            ...renderProps,
            id,
            ref,
            renderStyle: {...renderStyle, animatedStyle},
            children: SvgIcon && (
                <SvgIcon
                    fill={fill ?? theme.palette.surface.onSurfaceVariant}
                    height='100%'
                    viewBox='0 0 24 24'
                    width='100%'
                />
            )
        })
    }
)
