// Generated from: tests/features/categories.feature
import { test } from "../../../tests/fixtures/base.fixture.ts";

test.describe("Categories", () => {
  test(
    "User browses a category",
    { tag: ["@p1"] },
    async ({ Given, Then, page }) => {
      await Given('the user navigates to "/categorias/noticias"', null, {
        page,
      });
      await Then('they should see articles for the "noticias" category', null, {
        page,
      });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/categories.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p1"],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: "Context",
        textWithKeyword: 'Given the user navigates to "/categorias/noticias"',
        stepMatchArguments: [
          {
            group: {
              start: 22,
              value: '"/categorias/noticias"',
              children: [
                {
                  start: 23,
                  value: "/categorias/noticias",
                  children: [{ children: [] }],
                },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
      {
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: "Outcome",
        textWithKeyword:
          'Then they should see articles for the "noticias" category',
        stepMatchArguments: [
          {
            group: {
              start: 33,
              value: '"noticias"',
              children: [
                { start: 34, value: "noticias", children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
    ],
  },
]; // bdd-data-end
