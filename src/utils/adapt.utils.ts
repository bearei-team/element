import {Dimensions, PixelRatio, Platform} from 'react-native';

export interface AdaptOptions {
    designDensity?: number;
    designHeight?: number;
    designWidth?: number;
}

export const adapt = (
    {designWidth = 750, designHeight = 1334, designDensity = 2} = {} as AdaptOptions,
) => {
    const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
    const fontScale = PixelRatio.getFontScale();
    const heightScale = screenHeight / (designHeight / designDensity);
    const mobile = Platform.OS === 'ios' || Platform.OS === 'android';
    const widthScale = screenWidth / (designWidth / designDensity);
    const scale = Math.min(widthScale, heightScale);
    const adaptFontSize = (size: number) => (mobile ? Math.round(size * scale * fontScale) : size);
    const adaptSize = (size: number) => (mobile ? Math.round(size * scale) : size);

    return {
        adaptFontSize,
        adaptSize,
    };
};
