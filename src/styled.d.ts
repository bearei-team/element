import {Theme} from '@bearei/theme';
import {ColorSchemeName} from 'react-native';
import 'styled-components/native';

declare module 'styled-components/native' {
    export interface DefaultTheme extends Theme {
        adaptFontSize: (size: number) => number;
        adaptSize: (size: number) => number;
        colorScheme: ColorSchemeName;
        OS: RNPlatform.OS;
    }
}
