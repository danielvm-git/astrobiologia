// Generated from: tests/features/articles.feature
import { test } from "../../../tests/fixtures/base.fixture.ts";

test.describe("Articles", () => {
  test(
    "User opens an article",
    { tag: ["@p0", "@smoke"] },
    async ({ Given, When, Then, page }) => {
      await Given('the user navigates to "/artigos"', null, { page });
      await When("they click on the first article card", null, { page });
      await Then("they should see the article content", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/articles.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p0", "@smoke"],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: "Context",
        textWithKeyword: 'Given the user navigates to "/artigos"',
        stepMatchArguments: [
          {
            group: {
              start: 22,
              value: '"/artigos"',
              children: [
                { start: 23, value: "/artigos", children: [{ children: [] }] },
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
        textWithKeyword: "When they click on the first article card",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 9,
        gherkinStepLine: 10,
        keywordType: "Outcome",
        textWithKeyword: "Then they should see the article content",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
