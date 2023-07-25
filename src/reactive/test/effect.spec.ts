import { reactive } from "../reactive"
import { effect, stop } from "../effect"

describe("effect", () => {

    it("happy path", () => {
        const user = reactive({
            age: 10
        })
        let nextAge
        effect(() => {
            nextAge = user.age + 1
        })
        //update
        user.age++
        expect(nextAge).toBe(12)
    })

    it('should return runner when return effect', () => {
        let foo = 1;
        const runner = effect(() => {
            foo++;
            return 'foo'
        })

        expect(foo).toBe(2);
        const r = runner();
        expect(foo).toBe(3);
        expect(r).toBe('foo');

    })

    it('schdeuler', () => {
        let dummy: any
        let run: any
        const schdeuler = jest.fn(() => {
            run = runner
        })
        const obj = reactive({
            foo: 1
        })
        const runner = effect(() => {
            dummy = obj.foo
        }, { schdeuler })

        expect(schdeuler).not.toHaveBeenCalled();
        expect(dummy).toBe(1)
        obj.foo++
        expect(schdeuler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        run()
        expect(dummy).toBe(2)
    });


    it('stop', () => {
        let dummy
        const obj = reactive({ foo: 1 })
        const runner = effect(() => {
            dummy = obj.foo  
        })
        expect(dummy).toBe(1)
        obj.foo = 2
        expect(dummy).toBe(2)
        stop(runner)
        obj.foo = 3
        expect(dummy).toBe(2)

        runner()
        expect(dummy).toBe(3)
    });

    it('onStop', () => {
        let dummy
        const obj = reactive({
            foo: 1
        })
        const onStop = jest.fn()
        const runner = effect(() => {
            dummy = obj.foo
        }, { onStop })

        stop(runner)

        expect(onStop).toBeCalledTimes(1)
        obj.foo++
        expect(dummy).toBe(1)
    })

})