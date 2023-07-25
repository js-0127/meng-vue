export const extend = Object.assign


export function isObject(res) {
    return res !== null && typeof res === 'object'
}

export function isHasChanged(value, newValue) {
    return !Object.is(value, newValue)
}