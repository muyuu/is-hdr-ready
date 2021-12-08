export function selector(pairs) {
    pairs.forEach(({ key, id}) => {
        setParam(key, id);
        jump(key, id);
    });
}

function jump(key, id) {
    const params = new URLSearchParams(location.search);
    const targetFilter = document.getElementById(id);

    targetFilter.addEventListener('change', ({ currentTarget }) => {
        const val = currentTarget.value;
        val === '' ? params.delete(key) : params.set(key, val);
        const url = `${location.pathname}?${params.toString()}`;
        location.href = url;
    });

}

function setParam(key, id) {
    const { searchParams } = new URL(location.href);
    const pageType = searchParams.get(key);

    const supportedFilter = document.getElementById(id);

    Array.from(supportedFilter.options).forEach((option) => {
        if (pageType !== option.value)
            return;
        option.selected = true;
    });
}

export function onlySupported(pageType, supported) {
    return pageType === 'onlySupported' && supported === false;
}

export function onlySupportedKeySystem(pageType, requestMediaKeySystemAccess) {
    return pageType === 'onlySupportedKeySystem' && requestMediaKeySystemAccess === false;
}

export function lessThanLevel(levelParam, level) {
    const result = (levelParam <= 5 && level >= 6) ||
    (levelParam <= 4 && level >= 5) ||
    (levelParam <= 3 && level >= 4) ||
    (levelParam <= 2 && level >= 3) ||
    (levelParam <= 1 && level >= 2);
    return result;
}

