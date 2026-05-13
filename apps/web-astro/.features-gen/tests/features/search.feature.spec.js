// Generated from: tests/features/search.feature
import { test } from "../../../tests/fixtures/base.fixture.ts";

test.describe("Search", () => {
  test(
    "User searches for an article",
    { tag: ["@p1", "@migration-pending"] },
    async ({ Given, When, Then, page }) => {
      await Given('the user navigates to "/busca"', null, { page });
      await When('they search for "exoplaneta"', null, { page });
      await Then("they should see relevant results", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/search.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p1", "@migration-pending"],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: "Context",
        textWithKeyword: 'Given the user navigates to "/busca"',
        stepMatchArguments: [
          {
            group: {
              start: 22,
              value: '"/busca"',
              children: [
                { start: 23, value: "/busca", children: [{ children: [] }] },
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
        keywordType: "Action",
        textWithKeyword: 'When they search for "exoplaneta"',
        stepMatchArguments: [
          {
            group: {
              start: 16,
              value: '"exoplaneta"',
              children: [
                {
                  start: 17,
                  value: "exoplaneta",
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
        pwStepLine: 9,
        gherkinStepLine: 10,
        keywordType: "Outcome",
        textWithKeyword: "Then they should see relevant results",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
