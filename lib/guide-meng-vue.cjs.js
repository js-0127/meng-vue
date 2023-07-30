'use strict';

function createVNode(type, props, children) {
    return {
        type,
        props,
        children
    };
}

function isObject(res) {
    return res !== null && typeof res === 'object';
}

function createComponentInstance(vNode) {
    const component = {
        vNode,
        type: vNode.type
    };
    return component;
}
function setupComponentInstance(instance) {
    //todo
    //initProps
    //initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        const setupResult = setup();
        //判断返回值是Function还是Object
        handlerSetupResult(instance, setupResult);
    }
}
function handlerSetupResult(instance, setupResult) {
    //todo
    //function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    //判断是否有render
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    console.log(component);
    instance.render = component.render;
}

function render(vNode, container) {
    //patch
    patch(vNode, container);
}
function patch(vNode, container) {
    //处理组件 判断是不是element类型
    //是element走element逻辑
    //可以log一下vNode看看类型 是object->组件 是string -> element
    console.log(vNode.type);
    if (typeof vNode.type === 'string') {
        processElement(vNode, container);
    }
    else if (isObject(vNode.type)) {
        processComponent(vNode, container);
    }
}
function processElement(vNode, container) {
    //init 以及unpate
    //init
    mountElement(vNode, container);
}
function mountElement(vNode, container) {
    //type就是元素类型
    const el = document.createElement(vNode.type);
    //children就是el的值如果是基本类型就这样处理， 如果children是Array代表有后代，就用另外一种方式
    const { children } = vNode;
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vNode, el);
    }
    //props就是属性
    const { props } = vNode;
    for (const key in props) {
        const val = props[key];
        el.setAttribute(key, val);
    }
    container.append(el);
}
//挂载元素后代
function mountChildren(vNode, container) {
    vNode.children.forEach((v) => {
        patch(v, container);
    });
}
function processComponent(vNode, container) {
    mountComponent(vNode, container);
}
function mountComponent(vNode, container) {
    const instance = createComponentInstance(vNode);
    setupComponentInstance(instance);
    setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    //vnode -> patch -> Mountelement
    patch(subTree, container);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            // 先转换成vNode
            // component -> VNode
            //所有components基于vNode操作
            const vNode = createVNode(rootComponent);
            render(vNode, rootContainer);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
