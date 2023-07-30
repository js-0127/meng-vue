import { h } from '../../lib/guide-meng-vue.esm.js'
export const App = {

    render() {
        return h("div",

            {
                id: 'root',
                class: ["red", "layhead"]
            }
            , [h("p", { class: "red" }, "red"), h("p", { class: 'blue' }, "blue")])
    },

    setup() {
        return {
            msg: 'meng-vue'
        }
    }
}