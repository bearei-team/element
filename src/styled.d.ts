import 'styled-components/native';
import {Theme} from '@bearei/theme';

declare module 'styled-components/native' {
    export interface DefaultTheme extends Theme {}
}
