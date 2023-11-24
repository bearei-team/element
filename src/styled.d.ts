import {Theme} from '@bearei/theme';
import {ColorSchemeName} from 'react-native';
import 'styled-components/native';

declare module 'styled-components/native' {
    export interface DefaultTheme extends Theme {
        colorScheme: ColorSchemeName;
        OS: Platform.OS;
        adaptSize: (size: number) => number;
        adaptFontSize: (size: number) => number;
    }
}
