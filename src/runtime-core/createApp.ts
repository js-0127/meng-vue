import { createVNode } from "./vnode"
import { render } from "./render"

export function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vNode
            // component -> VNode
            //所有components基于vNode操作
            const vNode = createVNode(rootComponent)

            render(vNode, rootContainer)
        }
    }
}
