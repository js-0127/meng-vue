
import { computed } from "../computed"
import { reactive } from "../reactive"

describe("computed", () => {


    it("happy path", () => {
        const user = reactive({
            age: 1
        })

        const age = computed(() => {
            return user.age
        })

        expect(age.value).toBe(1)
    }),

        it("center ability", () => {
            const user = reactive({
                age: 1
            })
            const getter = jest.fn(() => {
                return user.age
            })

            const cvalue = computed(getter)
            //lazy 
            expect(getter).not.toHaveBeenCalled()
            expect(cvalue.value).toBe(1)
            expect(getter).toBeCalledTimes(1)

            //脏值检测
            cvalue.value
            expect(getter).toBeCalledTimes(1)
            expect(cvalue.value).toBe(1)

            //响应式
            user.age = 2
            expect(cvalue.value).toBe(2)
            expect(getter).toBeCalledTimes(2)


        })

})