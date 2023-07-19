
import { isReadonly } from "../baseHandler"
import { readonly } from "../reactive"
describe('reactive', () => {

    it('happy path', () => {
        const original = { foo: 1 }
        const observed = readonly(original)

        expect(observed).not.toBe(original)
        expect(isReadonly(observed)).toBe(true)

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