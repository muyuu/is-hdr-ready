// see: https://developer.mozilla.org/en-US/docs/Web/Media/Formats/codecs_parameter#avc_profiles
export const avcProfiles = [
    { name: 'Constrained Baseline Profile', num: '4240' },
    { name: 'Baseline Profile', num: '4200' },
    { name: 'Extended Profile', num: '5800' },
    { name: 'Main Profile', num: '4d00' },
    { name: 'High Profile', num: '6400' },
    { name: 'Progressive High Profile', num: '6408' },
    { name: 'Constrained High Profile', num: '640c' },
    { name: 'High 10 Profile', num: '6e00' },
    { name: 'High 4:2:2 Profile', num: '7a00' },
    { name: 'High 4:4:4 Predictive Profile', num: 'f400' },
    { name: 'High 10 Intra Profile', num: '6e10' },
    { name: 'High 4:2:2 Intra Profile', num: '7a10' },
    { name: 'High 4:4:4 Intra Profile', num: 'f410' },
    { name: 'CAVLC 4:4:4 Intra Profile', num: '4400' },
    { name: 'Scalable Baseline Profile', num: '5300' },
    { name: 'Scalable Constrained Baseline Profile', num: '5304' },
    { name: 'Scalable High Profile', num: '5600' },
    { name: 'Scalable Constrained High Profile', num: '5604' },
    { name: 'Scalable High Intra Profile', num: '5620' },
    { name: 'Stereo High Profile', num: '8000' },
    { name: 'Multiview High Profile', num: '7600' },
    { name: 'Multiview Depth High Profile', num: '8a00' },
];

// see: https://en.wikipedia.org/wiki/Advanced_Video_Coding#Levels
export const avcLevels = [
    1, 1.1, 1.2, 1.3,
    2, 2.1, 2.2,
    3, 3.1, 3.2,
    4, 4.1, 4.2,
    5, 5.1, 5.2,
    6, 6.1, 6.2,
];

/**
 *
 * @param {number} float 10進数の数値
 * @returns {string} 10進数を10倍した数値を16進数として表現したもの
 */
 export function float2hex4level(float) {
    const a = float * 10;
    const hex = (a).toString(16);
    return hex.length <= 1 ? '0' + hex : hex;
}
