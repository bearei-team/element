import {ViewStyle} from 'react-native'
import {useTheme} from 'styled-components/native'

import {RenderProps} from './ChipBase'

type UseBorderOptions = Pick<RenderProps, 'elevated'>

export const useBorder = ({elevated}: UseBorderOptions) => {
    const theme = useTheme()
    const borderPosition = {borderWidth: theme.adaptSize(1)}

    return [
        !elevated && {
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition
        }
    ]
}
