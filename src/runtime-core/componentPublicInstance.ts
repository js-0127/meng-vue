const publicProperMap = {
    "$el": (i) => i.vNode.el
}


export const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        //setupState
        const { setupState } = instance
        if (key in setupState) {
            return setupState[key]
        }
        // key-> $el
        const publicGetter = publicProperMap[key]
        if (publicGetter) {
            return publicGetter(instance)
        }
    }
}

