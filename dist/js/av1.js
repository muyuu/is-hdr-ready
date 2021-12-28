// see: https://aomediacodec.github.io/av1-isobmff/#codecsparam
export const av1Profiles = [
    { name: 'Main profile', num: '0', desc: 'supports YUV 4:2:0 or monochrome bitstreams with bit depth of 8 or 10 bits per component.' },
    { name: 'High profile', num: '1', desc: 'adds support for 4:4:4 chroma subsampling.' },
    { name: 'Professional profile', num: '2', desc: 'adds support for 4:2:2 chroma subsampling and 12 bit per component color.' },
];

// see: https://aomediacodec.github.io/av1-spec/#levels
export const av1Levels = [
    2.0, 2.1, 2.2, 2.3,
    3, 3.1, 3.2, 3.3,
    4, 4.1, 4.2, 4.3,
    5, 5.1, 5.2, 5.3,
    6, 6.1, 6.2, 6.3,
    7, 7.1, 7.2, 7.3,
];

export const av1Tiers = [
    'M',
    'H',
];

export const av1Depth = [
    8,
    10,
    12,
]

/**
 * change level to sequence level ID for AV1
 * see: https://aomediacodec.github.io/av1-spec/#levels
 * @param {number} lv - level
 * @returns {number} - sequence level ID
 */
export function level4Seq4AV1(lv) {
    const [a, b] = lv.toString().split('.');
    const _a = parseInt(a, 10) - 2 << 2;
    const _b = parseInt(b, 10) & 3;
    return _a + _b;
}
