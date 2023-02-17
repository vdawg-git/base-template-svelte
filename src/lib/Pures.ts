export {}

if (import.meta.vitest) {
  const { test, expect, describe } = import.meta.vitest

  describe("sumUpStringsAsNumber", () => {
    test("happy", () => {
      console.log("No tests here")
      expect(true).toBeTruthy()
    })
  })
}
