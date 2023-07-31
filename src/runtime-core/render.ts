import { isObject } from "../shared/index";
import { createComponentInstance, setupComponentInstance } from "./component"

export function render(vNode, container) {

    //patch
    patch(vNode, container)
}

function patch(vNode, container) {

    //处理组件 判断是不是element类型
    //是element走element逻辑

    //可以log一下vNode看看类型 是object->组件 是string -> element

    if (typeof vNode.type === 'string') {
        processElement(vNode, container)
    } else if (isObject(vNode.type)) {
        processComponent(vNode, container)
    }
}

function processElement(vNode, container) {
    //init 以及unpate
    //init
    mountElement(vNode, container)
}

function mountElement(vNode, container) {

    const { type, props, children } = vNode
    //type就是元素类型
    const el = (vNode.el = document.createElement(type))

    //children就是el的值如果是基本类型就这样处理， 如果children是Array代表有后代，就用另外一种方式

    if (typeof children === 'string') {
        el.textContent = children
    } else if (Array.isArray(children)) {
        mountChildren(vNode, el)
    }

    //props就是属性

    for (const key in props) {
        const val = props[key]
        el.setAttribute(key, val)
    }

    container.append(el)
}

//挂载元素后代
function mountChildren(vNode, container) {
    vNode.children.forEach((v) => {
        patch(v, container)
    })
}

function processComponent(vNode, container) {
    mountComponent(vNode, container)
}

function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode)

    setupComponentInstance(instance)
    setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance
    const subTree = instance.render.call(proxy)
    //vnode -> patch -> Mountelement
    patch(subTree, container)
    initialVnode.el = subTree.el
} 