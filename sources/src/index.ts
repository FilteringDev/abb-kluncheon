type unsafeWindow = typeof window
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const unsafeWindow: unsafeWindow

const Win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

let AdblockDetectPositiveRegExps: RegExp[][] = [[
  /if *\( *typeof *window *\[ *[A-Za-z0-9]+\( *[0-9]+ *\) *\] *!== *[A-Za-z0-9]+\( *[0-9]+ *\) *\) *{/,
  /const *[a-zA-Z0-9]+ *= *setTimeout *\( *\( *\) *=> *{/,
  /typeof *[A-Za-z0-9]+ *!== *[A-Za-z0-9]+ *\( *[0-9a-f]+ *\) *\|\| *[A-Za-z0-9]+ *===? *void *0 *\|\| *[A-Za-z0-9]+ *===? *null *\|\| *[A-Za-z0-9]+ *===? *('|")+ *\)/
]]

Win.Promise = new Proxy(Win.Promise, {
  construct(Target: typeof Promise, Args: ConstructorParameters<typeof Promise>) {
    if (typeof Args[0] === 'function' && AdblockDetectPositiveRegExps.filter(RegExpList => RegExpList.filter(Reg => Reg.test(Args[0].toString())).length >= 3).length === 1) {
      return new Promise(async () => {})
    }
    return Reflect.construct(Target, Args)
  }
})