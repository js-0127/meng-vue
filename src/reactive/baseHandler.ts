import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()
const getReadonly = createGetter(true)


export const enum reactiveFlags {
    IS_REACTIVE = '__v_isReactive',
    IS_READONLY = '__v_isReadonly'
}
function createGetter(isReadonly = false) {
    return function get(target, key) {
        const res = Reflect.get(target, key)
        if (key === reactiveFlags.IS_REACTIVE) {
            return !isReadonly
        } else if (key === reactiveFlags.IS_READONLY) {
            return isReadonly
        }
        if (!isReadonly) {
            track(target, key)
        }
        return res
    }
}

function createSetter() {
    return function set(target, key, value) {
        const res = Reflect.set(target, key, value)
        trigger(target, key)
        return res
    }
}

export const mutableHandler = {
    get,
    set
}
export const readonlyHandler = {
    get: getReadonly,
    set(target, key, value) {
        console.warn(`${key}不能set 因为target 是readonly`, target)
        return true
    }
}

export function isReactive(value) {
    //要是我们挂载的对象不是Proxy，那么就会变成undefined所以用!!转换成布尔值
    return !!value[reactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
    return !!value[reactiveFlags.IS_READONLY]
}