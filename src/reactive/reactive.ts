import { mutableHandler, readonlyHandler, shallowReaonlyHandler } from "./baseHandler"


export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandler)
    // return new Proxy(raw, mutableHandler)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandler)
    // return new Proxy(raw, readonlyHandler)
}

export function shallowReadonly(raw) {
    return createActiveObject(raw, shallowReaonlyHandler)
}


function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}
