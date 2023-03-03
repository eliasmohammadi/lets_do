export class Mapper {
    static from<T, U>(t:T,cb:Mapper.MapFunction<T, U>): U {
        return cb(t)
    }
}
namespace Mapper {
    export type MapFunction<T, U> = (t:T) => U
}