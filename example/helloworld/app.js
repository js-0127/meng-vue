import { h } from '../../lib/guide-meng-vue.esm.js'

window.self = null
export const App = {

    render() {
        window.self = this
        return h("div",

            {
                id: 'root',
                class: ["red", "layhead"]
            },
            //数组类型的children时
            // , [h("p", { class: "red" }, "red"), h("p", { class: 'blue' }, "blue")]
            //普通类型
            "hi," + this.msg
        )
    },

    setup() {
        return {
            msg: 'meng-vue!'
        }
    }
}