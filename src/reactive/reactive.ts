import { mutableHandler, readonlyHandler } from "./baseHandler"


export function reactive(raw: any) {
    return createActiveObject(raw, mutableHandler)
    // return new Proxy(raw, mutableHandler)
}

export function readonly(raw) {
    return createActiveObject(raw, readonlyHandler)
    // return new Proxy(raw, readonlyHandler)
}

function createActiveObject(raw: any, baseHandlers) {
    return new Proxy(raw, baseHandlers)
}