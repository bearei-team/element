import {ViewStyle} from 'react-native'
import {useTheme} from 'styled-components/native'
import {RenderProps} from './IconButtonBase'

type UseBorderOptions = Pick<RenderProps, 'type'>

export const useBorder = ({type}: UseBorderOptions) => {
    const theme = useTheme()
    const borderPosition = {borderWidth: theme.adaptSize(1)}

    return [
        type === 'outlined' && {
            borderStyle: 'solid' as ViewStyle['borderStyle'],
            ...borderPosition
        }
    ]
}
