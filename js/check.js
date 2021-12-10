import { float2hex4level } from './avc.js';
import { level4Seq4AV1 } from './av1.js';
import { isSafari } from './ua.js';

export const OK = "🙆‍♀️";
export const NG = "🙅‍♂️";

/**
 *
 * @param {string} fourCC
 * @param {Array<{ name: string, hex: string }>} profiles
 * @param {Array<number>} levels
 * @param {Array<string> | undefined} tiers
 * @param {Array<number> | undefined} depth
 * @returns Array<{ profile: string, level: number, codecStr: string}>
 */
export function getCodecs(fourCC, profiles, levels, tiers, depth) {
    return profiles.map((profile) => {
        return levels.map((level) => {
            if (tiers === undefined && depth === undefined) {
                const codecStr = getCodecStr(fourCC, profile, level);
                const s = {
                    profile: profile.name,
                    level,
                    codecStr,
                };
                return s;
            }

            return tiers.map((tier) => {
                return depth.map((d) => {
                    const codecStr = getCodecStr(fourCC, profile, level, tier, d);
                    const s = {
                        profile: profile.name,
                        level,
                        codecStr,
                    };
                    return s;
                }).flat();
            }).flat();
        }).flat();
    })
    .flat();
}

function getCodecStr(fourCC, profile, level, tier, depth) {
    switch (fourCC) {
        case 'avc1':
            const hexLevel = float2hex4level(level);
            return `${fourCC}.${profile.num}${hexLevel}`;
        case 'vp09':
            const vp9level = level * 10;
            const bit = profile.num >= 2 ? '10' : '08';
            return `${fourCC}.0${profile.num}.${vp9level}.${bit}`;
        case 'av01':
            const av1level = level4Seq4AV1(level).toString().padStart(2, '0');
            const av1depth = depth.toString().padStart(2, '0');
            return `${fourCC}.${profile.num}.${av1level}${tier}.${av1depth}`;
        default:
            break;
    }
}

export async function check({
    codecStr,
    container = 'mp4',
    width = 800,
    height = 600,
    bitrate = 10000,
    framerate = 30,
}) {
    const type = `video/${container};codecs="${codecStr}"`;
    const mediaKeySystemAccessConfigurations = [{
        "initDataTypes": ["cenc"],
        "videoCapabilities": [{
            "robustness": "SW_SECURE_CRYPTO",
            "contentType": type,
        }],
    }];

    const keysystem = getKeySystemString();
    const requestMediaKeySystemAccess = await navigator
        .requestMediaKeySystemAccess(
            keysystem,
            mediaKeySystemAccessConfigurations,
        ).then(() => true).catch(() => false);

    const videoDecodingConfiguration = {
        type: 'media-source',
        video: {
            contentType: type,
            width,
            height,
            bitrate,
            framerate,
        }
    };
    const decodingInfo = await navigator.mediaCapabilities
        .decodingInfo(videoDecodingConfiguration)
        .then((v) => ({ supported: v.supported, powerEfficient: v.powerEfficient, smooth: v.smooth }));

    return { type, ...decodingInfo, requestMediaKeySystemAccess };
}

function getKeySystemString() {
    if (isSafari) return 'com.apple.fps.1_0';
    return 'com.widevine.alpha';
}