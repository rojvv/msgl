import { assertStringIncludes } from "@std/assert";
import translations from "./translations.ts";

Deno.test("ru", () => {
  const actual = translations.ru.remaining(1, 0);
  assertStringIncludes(actual, "1 сообщение");
  for (let i = 2; i <= 4; ++i) {
    const actual = translations.ru.remaining(i, 0);
    assertStringIncludes(actual, `${i} сообщения`);
  }
  for (let i = 5; i <= 1_000_000; ++i) {
    const actual = translations.ru.remaining(i, 0);
    let expected = "сообщений";
    if (
      !i.toString().endsWith("12") &&
      !i.toString().endsWith("13") &&
      !i.toString().endsWith("14") &&
      ["2", "3", "4"].includes(i.toString().slice(-1)[0])
    ) {
      expected = "сообщения";
    }
    assertStringIncludes(actual, expected);
  }
  for (let i = 5; i <= 1_000_000; ++i) {
    const actual = translations.ru.disappared(i, 0);
    const expected = i == 1 ? "сообщения" : "сообщений";
    assertStringIncludes(actual, expected);
  }
});
