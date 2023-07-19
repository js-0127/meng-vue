import { extend } from "../shared";

class reactiveEffect {
    //传入effect的函数
    private _fn: any;
    //控制是否stop做清空处理
    active = true
    //收集依赖, 用于将依赖清空实现stop
    deps: any = [];
    //stop之后的回调
    onStop?: () => void

    constructor(fn, public scheduler?: Function) {
        this._fn = fn
        this.scheduler = scheduler
    }
    run() {
        //我们要控制，当我们stop之后停止依赖的收集，所以这里要控制
        if (!this.active) {
            return this._fn()
        }
        //收集依赖
        shouldTrack = true
        activeEffect = this
        const res = this._fn()
        shouldTrack = false
        return res
    }
    stop() {
        if (this.active) {
            clearEffect(this)
            if (this.onStop) {
                this.onStop()
            }
            this.active = false
        }
    }
}

function clearEffect(effect: any) {
    effect.deps.forEach((dep: any) => {
        dep.delete(effect)
    })
    effect.deps.length = 0
}
//target ——> key ——> dep 结构 weakMap ——> map ——> set
const targetMap = new WeakMap()
//控制依赖是否收集
let shouldTrack = true
export function track(target, key) {
    let depMap = targetMap.get(target)
    //解决初始化不存在的问题
    if (!depMap) {
        depMap = new Map()
        targetMap.set(target, depMap)
    }
    let dep = depMap.get(key)
    //解决初始化不存在的问题
    if (!dep) {
        dep = new Set()
        depMap.set(key, dep)
    }
    // 这里我们用下面的isTrack来优化
    /*如果没有依赖项，就直接返回
    if (!activeEffect) return;
    //如果不要收集依赖，这里直接返回
    if (!shouldTrack) return;*/
    if (!isTrack(activeEffect, shouldTrack)) return
    //收集依赖, 我们需要拿到fn 如果依赖中存在activeEffect 就直接return 不再收集了
    if (dep.has(activeEffect)) return
    dep.add(activeEffect)
    //这里我们将
    activeEffect.deps.push(dep)
}

function isTrack(activeEffect, shouldTrack) {
    return shouldTrack && activeEffect
}
export function trigger(target, key) {
    const depMap = targetMap.get(target)
    const deps = depMap.get(key)

    for (const dep of deps) {
        if (dep.scheduler) {
            dep.scheduler()
        } else {
            dep.run()
        }
    }
}
//创建全局变量, 确保dep能拿到fn
let activeEffect

export function effect(fn, options: any = {}) {
    const _effect = new reactiveEffect(fn, options.schdeuler)
    extend(_effect, options)
    _effect.run()

    const runner: any = _effect.run.bind(_effect)
    runner._effect = _effect
    return runner
}

export function stop(runner) {
    return runner._effect.stop()
}