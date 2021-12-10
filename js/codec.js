import { OK, NG, getCodecs, check } from './check.js';
import { selector, onlySupported, onlySupportedKeySystem, onlyLevel } from './selector.js';
import { avcProfiles, avcLevels } from './avc.js';
import { vp9Profiles, vp9Levels } from './vp9.js';
import { av1Profiles, av1Levels , av1Tiers, av1Depth} from './av1.js';

const codecList = {
    avc: { name: 'AVC', codec4CC: 'avc1', profiles: avcProfiles, levels: avcLevels, tiers: undefined, depth: undefined },
    vp9: { name: 'VP9', codec4CC: 'vp09', profiles: vp9Profiles, levels: vp9Levels, tiers: undefined, depth: undefined },
    av1: { name: 'AV1', codec4CC: 'av01', profiles: av1Profiles, levels: av1Levels, tiers: av1Tiers, depth: av1Depth },
};

function main() {
    const pairs = [
        { key: 'container', id: 'containerFilter'},
        { key: 'codec', id: 'codecFilter'},
        { key: 'resolution', id: 'resolutionFilter'},
        { key: 'framerate', id: 'framerateFilter'},
        { key: 'bitrate', id: 'bitrateFilter'},
        { key: 'type', id: 'supportedFilter'},
        { key: 'level', id: 'levelFilter'},
    ];
    selector(pairs);
    put();
}

async function put() {
    const containerFilter = document.getElementById('containerFilter');
    const resolutionFilter = document.getElementById('resolutionFilter');
    const bitrateFilter = document.getElementById('bitrateFilter');
    const framerateFilter = document.getElementById('framerateFilter');
    const codecFilter = document.getElementById('codecFilter');
    const codecType = codecFilter.value;
    const codecName = codecList[codecType].name;
    const codec4CC = codecList[codecType].codec4CC;
    const profiles = codecList[codecType].profiles;
    const levels = codecList[codecType].levels;
    const tiers = codecList[codecType].tiers;
    const depth = codecList[codecType].depth;

    const tbody = document.getElementById('result');
    const codecs = getCodecs(codec4CC, profiles, levels, tiers, depth);
    const container = containerFilter.value;
    const height = resolutionFilter.value;
    const width = height / 9 * 16;
    const bitrate = bitrateFilter.value;
    const framerate = framerateFilter.value;
    let counter = 0;

    for (let codec of codecs) {
        const { level, codecStr } = codec;
        const r = await check({ codecStr, container, width, height, bitrate, framerate });

        const { searchParams } = new URL(location.href);
        const pageType = searchParams.get('type');
        const levelParam = searchParams.get('level') === null ? null : parseInt(searchParams.get('level'), 10);
        if ( onlySupported(pageType, r.supported) ) {
            continue;
        }

        if ( onlySupportedKeySystem(pageType, r.requestMediaKeySystemAccess) ) {
            continue;
        }

        if ( !onlyLevel(levelParam, level) ) {
            continue;
        }

        put2dom(codecName, tbody, r, codec);
        counter++;
    }
    putHowMany('howMany', counter);
}

function put2dom(name, parentNode, r, codec) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    const td3 = document.createElement('td');
    const td4 = document.createElement('td');
    const td5 = document.createElement('td');
    const td6 = document.createElement('td');

    const id = encodeURI(r.type);
    td1.id = id;

    td3.classList = `tac ${r.supported ? 'success' : 'fail'}`;
    td4.classList = `tac ${r.smooth ? 'success' : 'warn'}`;
    td5.classList = `tac ${r.powerEfficient ? 'success' : 'warn'}`;
    td6.classList = `tac ${r.requestMediaKeySystemAccess ? 'success' : 'fail'}`;

    td1.innerHTML = `${name}: ${codec.profile} Level${codec.level}`;
    td2.innerHTML = `<a href="${location.href + "#" + id}">${r.type}</a>`;
    td3.innerHTML = r.supported ? OK : NG;
    td4.innerHTML = r.smooth ? OK : NG;
    td5.innerHTML = r.powerEfficient ? OK : NG;
    td6.innerHTML = r.requestMediaKeySystemAccess ? OK : NG;

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    parentNode.appendChild(tr);
}

function putHowMany(id, result) {
    const el = document.getElementById(id);
    el.innerText = result;
}

window.addEventListener('load', main);
