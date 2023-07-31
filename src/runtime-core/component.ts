import { PublicInstanceProxyHandlers } from "./componentPublicInstance"

export function createComponentInstance(vNode) {
    const component = {
        vNode,
        type: vNode.type,
        proxy: {}
    }
    return component
}


export function setupComponentInstance(instance) {
    //todo
    //initProps
    //initSlots

    setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {

    const component = instance.type

    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers)
    const { setup } = component

    if (setup) {
        const setupResult = setup()

        //判断返回值是Function还是Object
        handlerSetupResult(instance, setupResult)
    }


}

function handlerSetupResult(instance, setupResult) {
    //todo
    //function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult
    }
    //判断是否有render
    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const component = instance.type

    instance.render = component.render

}