declare module 'shallow-equal' {
    export function shallowEqualArrays(a?: any[] , b?: any[]): boolean;

    export function shallowEqualObjects(a?: object, b?: object): boolean;
}