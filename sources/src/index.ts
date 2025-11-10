type unsafeWindow = typeof window
// eslint-disable-next-line @typescript-eslint/naming-convention
declare const unsafeWindow: unsafeWindow

const Win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window

let AdblockDetectPositiveRegExps: RegExp[][] = [[
  /if *\( *typeof *window *\[ *\w+\( *\d+ *\) *\] *!== *\w+\( *\d+ *\) *\) *{/,
  /const *\w+ *= *setTimeout *\( *\( *\) *=> *{/,
  /typeof *\w+ *!== *\w+ *\( *[\da-f]+ *\) *\|\| *\w+ *===? *void *0 *\|\| *\w+ *===? *null *\|\| *\w+ *===? *('|")+ *\)/
]]

Win.Promise = new Proxy(Win.Promise, {
  construct(Target: typeof Promise, Args: ConstructorParameters<typeof Promise>) {
    if (typeof Args[0] === 'function' && AdblockDetectPositiveRegExps.filter(RegExpList => RegExpList.filter(Reg => Reg.test(Args[0].toString())).length >= 3).length === 1) {
      return new Promise(async () => {})
    }
    return Reflect.construct(Target, Args)
  }
})
