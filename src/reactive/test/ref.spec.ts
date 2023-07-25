import { effect } from "../effect"
import { reactive } from "../reactive"
import { ref, isRef, unRef, ProxyRefs } from "../ref"

describe("it should be a ref", () => {

    it("happy path", () => {
        let obj = ref(1)
        expect(obj.value).toBe(1)
    })


    it('it should be effect', () => {
        let dummy
        let obj = ref(1)
        let count = 0
        effect(() => {
            count++
            dummy = obj.value
        })
        expect(count).toBe(1)
        expect(dummy).toBe(1)

        obj.value = 2
        expect(count).toBe(2)
        expect(dummy).toBe(2)

        obj.value = 2
        expect(count).toBe(2)
        expect(dummy).toBe(2)
    })

    it("ref Object should be a reactive", () => {
        let obj = ref({ age: 123 })
        let dummy
        let count = 0
        effect(() => {
            count++
            dummy = obj.value.age
        })

        expect(count).toBe(1)
        expect(dummy).toBe(123)
        obj.value.age = 222
        expect(count).toBe(2)
        expect(dummy).toBe(222)
    })


    it("it should return a boolean", () => {
        let obj = ref(1)
        let a = 1
        let b = reactive({ user: 1 })

        expect(isRef(obj)).toBe(true)
        expect(isRef(a)).toBe(false)
        expect(isRef(b)).toBe(false)
    })

    it("it should return a value", () => {
        let obj = ref(2)
        let a = 1

        expect(unRef(obj)).toBe(2)
        expect(unRef(a)).toBe(1)
    })

    it("it test ProxyRefs", () => {
        const user = {
            name: ref("meng"),
            age: 18
        }

        const ProxyUser = ProxyRefs(user)
        expect(user.name.value).toBe("meng")
        expect(ProxyUser.name).toBe("meng")
        expect(ProxyUser.age).toBe(18)

        ProxyUser.name = ref("chao")
        expect(ProxyUser.name).toBe("chao")
        expect(user.name.value).toBe("chao")

        ProxyUser.name = "40"
        expect(ProxyUser.name).toBe("40")
        expect(user.name.value).toBe("40")

    })


})

