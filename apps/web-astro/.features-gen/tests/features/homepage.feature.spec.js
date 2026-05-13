// Generated from: tests/features/homepage.feature
import { test } from "../../../tests/fixtures/base.fixture.ts";

test.describe("Homepage", () => {
  test(
    "Homepage loads correctly",
    { tag: ["@p0", "@smoke"] },
    async ({ Given, Then, And, page }) => {
      await Given("the user is on the homepage", null, { page });
      await Then('the page title should contain "Astrobiologia"', null, {
        page,
      });
      await And("I should see the main navigation", null, { page });
      await And("I should see at least one article card", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/homepage.feature"),
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
        textWithKeyword: "Given the user is on the homepage",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: "Outcome",
        textWithKeyword: 'Then the page title should contain "Astrobiologia"',
        stepMatchArguments: [
          {
            group: {
              start: 30,
              value: '"Astrobiologia"',
              children: [
                {
                  start: 31,
                  value: "Astrobiologia",
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
        textWithKeyword: "And I should see the main navigation",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 10,
        gherkinStepLine: 11,
        keywordType: "Outcome",
        textWithKeyword: "And I should see at least one article card",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
