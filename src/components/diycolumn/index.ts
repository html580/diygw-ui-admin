import type { App } from 'vue'
const modules = import.meta.globEager('./*.(tsx|vue)')

const components: any = []
for (const path in modules) {
    const comp = modules[path].default
    components.push(comp)
}

const install = (Vue: App) => {
    components.forEach((component: any) => {
        Vue.component(component.name, component)
    });
}

export default {
    install
}