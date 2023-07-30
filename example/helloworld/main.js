import { createApp } from '../../lib/guide-meng-vue.esm.js'

import { App } from './app.js'
//vue3
const rootContainer = document.querySelector("#app")
createApp(App).mount(rootContainer)