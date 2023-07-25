import { isProxy, isReactive, isReadonly } from "../baseHandler"
import { reactive, readonly } from "../reactive"
describe('reactive', () => {

    it('happy path', () => {
        const original = { foo: 1 }
        const user = reactive({
            name: {
                fistName: 'meng'
            }
        })
        const observed = reactive(original)

        const obj = reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(user.name)).toBe(true)
       
        expect(isProxy(user)).toBe(true)
        expect(isProxy(original)).toBe(false)
    })
})