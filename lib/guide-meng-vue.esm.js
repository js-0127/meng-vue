function createVNode(type, props, children) {
    const vNode = {
        type,
        props,
        children,
        el: null
    };
    return vNode;
}

function isObject(res) {
    return res !== null && typeof res === 'object';
}

const publicProperMap = {
    "$el": (i) => i.vNode.el
};
const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
        //setupState
        const { setupState } = instance;
        if (key in setupState) {
            return setupState[key];
        }
        // key-> $el
        const publicGetter = publicProperMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vNode) {
    const component = {
        vNode,
        type: vNode.type,
        proxy: {}
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
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
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
    const { type, props, children } = vNode;
    //type就是元素类型
    const el = (vNode.el = document.createElement(type));
    //children就是el的值如果是基本类型就这样处理， 如果children是Array代表有后代，就用另外一种方式
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vNode, el);
    }
    //props就是属性
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
function mountComponent(initialVnode, container) {
    const instance = createComponentInstance(initialVnode);
    setupComponentInstance(instance);
    setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    //vnode -> patch -> Mountelement
    patch(subTree, container);
    initialVnode.el = subTree.el;
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

export { createApp, h };
