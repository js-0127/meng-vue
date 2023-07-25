
import { isHasChanged, isObject } from "../shared"
import { trackEffect, tiggerEffect, isTrack } from "./effect"
import { reactive } from "./reactive"
class RefImpl {
    private _value
    private _raw
    public dep
    //是否是ref的标识
    public __v_isRef = true
    constructor(value) {
        //保存没有代理前的value
        this._raw = value
        //做对象类型检测
        this._value = isObject(value) ? reactive(value) : value
        this.dep = new Set()
    }
    get value() {
        trackRefValue(this.dep)
        return this._value

    }
    set value(newValue) {
        if (!isHasChanged(this._raw, newValue)) return
        this._raw = newValue
        this._value = newValue
        tiggerEffect(this.dep)

    }
}

export function trackRefValue(dep) {
    if (isTrack()) {
        trackEffect(dep)
    }
}

export function ref(value) {
    return new RefImpl(value)
}


export function isRef(value) {
    return !!value.__v_isRef
}

export function unRef(ref) {
    return isRef(ref) ? ref.value : ref
}

export function ProxyRefs(objectWithRef) {
    return new Proxy(objectWithRef, {
        get(target, key) {
            const res = unRef(Reflect.get(target, key))
            return res
        },
        set(target, key, value) {
            
            if (isRef(target[key]) && !isRef(value)) {
                return target[key].value = value
            } else {
                return Reflect.set(target, key, value)
            }
        }
    })
}