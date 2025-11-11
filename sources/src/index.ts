type unsafeWindow = typeof window
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const unsafeWindow: unsafeWindow

const Win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

let AdblockDetectInnerPromiseTrapRegExps: RegExp[][] = [[
  /if *\( *typeof *window *\[ *\w+\( *\d+ *\) *\] *!== *\w+\( *\d+ *\) *\) *{/,
  /const *\w+ *= *setTimeout *\( *\( *\) *=> *{/,
  /const *\w *= *window *\[ *\w *\( *\d+ *\) *\] *\[ *\w+ *\( *\d+ *\) *\] *\( *\) *;/,
  / *\w+ *\( *! *\w+ *\|\| *\w+ *=== *"" *\) *} *catch *{ *clearTimeout *\( *\w+ *\) *, *\w+ *\( */
]]

Win.Promise = new Proxy(Win.Promise, {
  construct(Target: typeof Promise, Args: ConstructorParameters<typeof Promise>) {
    if (typeof Args[0] === 'function' && AdblockDetectInnerPromiseTrapRegExps.filter(RegExpList => RegExpList.filter(Reg => Reg.test(Args[0].toString())).length >= 4).length === 1) {
      return Reflect.construct(Target, [() => {}])
    }
    return Reflect.construct(Target, Args)
  }
})
