import { Dimensions, PixelRatio } from 'react-native';

// Guideline sizes are based on standard ~5.5" screen mobile device
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const guidelineBaseWidth = 375; // iPhone X width
const guidelineBaseHeight = 812; // iPhone X height

export const scale = (size: number) => (SCREEN_WIDTH / guidelineBaseWidth) * size;
export const verticalScale = (size: number) => (SCREEN_HEIGHT / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export const spacing = (unit = 1) => Math.round(moderateScale(8) * unit);
