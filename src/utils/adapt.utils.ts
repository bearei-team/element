import {Dimensions, PixelRatio, Platform} from 'react-native';

export interface AdaptOptions {
    designWidth?: number;
    designHeight?: number;
    designDensity?: number;
}

export const adapt = ({
    designWidth = 750,
    designHeight = 1334,
    designDensity = 2,
}: AdaptOptions = {}) => {
    const {width: screenWidth, height: screenHeight} = Dimensions.get('window');
    const widthScale = screenWidth / (designWidth / designDensity);
    const heightScale = screenHeight / (designHeight / designDensity);
    const scale = Math.min(widthScale, heightScale);
    const fontScale = PixelRatio.getFontScale();
    const mobile = Platform.OS === 'ios' || Platform.OS === 'android';

    const adaptSize = (size: number) => (mobile ? Math.round(size * scale) : size);
    const adaptFontSize = (size: number) => (mobile ? Math.round(size * scale * fontScale) : size);

    return {
        adaptSize,
        adaptFontSize,
    };
};
