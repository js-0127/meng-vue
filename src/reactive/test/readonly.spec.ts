
import { isProxy, isReadonly } from "../baseHandler"
import { readonly, shallowReadonly } from "../reactive"
describe('readonly', () => {

    it('happy path', () => {
        const original = { foo: 1 }
        const user = readonly({
            name: {
                lastName: 'luo'
            }
        })
        
        const test = shallowReadonly({profile: {salary: 100}})
        expect(isReadonly(user.name)).toBe(true)
        const observed = readonly(original)

        expect(observed).not.toBe(original)
        expect(isReadonly(observed)).toBe(true)

        expect(isReadonly(test)).toBe(true)
        expect(isReadonly(test.profile)).toBe(false)

        expect(isProxy(user)).toBe(true)
        expect(isReadonly(original)).toBe(false)
    })

    it('warn', () => {

        console.warn = jest.fn()
        const user = readonly({
            age: 10
        })
        user.age++
        expect(console.warn).toBeCalled()
    })
})