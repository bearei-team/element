import 'styled-components/native';
import {Theme} from '@bearei/theme';
import {Platform, ColorSchemeName} from 'react-native';

declare module 'styled-components/native' {
    export interface DefaultTheme extends Theme {
        OS: Platform.OS;
        colorScheme: ColorSchemeName;
    }
}
