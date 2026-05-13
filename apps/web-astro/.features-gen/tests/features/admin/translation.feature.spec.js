// Generated from: tests/features/admin/translation.feature
import { test } from "../../../../tests/fixtures/base.fixture.ts";

test.describe("Admin Translation Flow", () => {
  test(
    "Admin translates an article to English",
    { tag: ["@p0", "@admin", "@translation", "@migration-pending"] },
    async ({ Given, When, Then, And, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await And("they are editing an existing article", null, { page });
      await When('they click the "EN" translation tab', null, { page });
      await And('they click "Traduzir com DeepL"', null, { page });
      await Then('the "English" title and content should be populated', null, {
        page,
      });
      await When("they save the translation", null, { page });
      await Then(
        'the "English" version should be accessible at its slug',
        null,
        { page }
      );
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/admin/translation.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p0", "@admin", "@translation", "@migration-pending"],
    steps: [
      {
        pwStepLine: 7,
        gherkinStepLine: 8,
        keywordType: "Context",
        textWithKeyword: "Given the user is logged in as admin",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 8,
        gherkinStepLine: 9,
        keywordType: "Context",
        textWithKeyword: "And they are editing an existing article",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 9,
        gherkinStepLine: 10,
        keywordType: "Action",
        textWithKeyword: 'When they click the "EN" translation tab',
        stepMatchArguments: [
          {
            group: {
              start: 15,
              value: '"EN"',
              children: [
                { start: 16, value: "EN", children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
      {
        pwStepLine: 10,
        gherkinStepLine: 11,
        keywordType: "Action",
        textWithKeyword: 'And they click "Traduzir com DeepL"',
        stepMatchArguments: [
          {
            group: {
              start: 11,
              value: '"Traduzir com DeepL"',
              children: [
                {
                  start: 12,
                  value: "Traduzir com DeepL",
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
        pwStepLine: 11,
        gherkinStepLine: 12,
        keywordType: "Outcome",
        textWithKeyword:
          'Then the "English" title and content should be populated',
        stepMatchArguments: [
          {
            group: {
              start: 4,
              value: '"English"',
              children: [
                { start: 5, value: "English", children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
      {
        pwStepLine: 12,
        gherkinStepLine: 13,
        keywordType: "Action",
        textWithKeyword: "When they save the translation",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 13,
        gherkinStepLine: 14,
        keywordType: "Outcome",
        textWithKeyword:
          'Then the "English" version should be accessible at its slug',
        stepMatchArguments: [
          {
            group: {
              start: 4,
              value: '"English"',
              children: [
                { start: 5, value: "English", children: [{ children: [] }] },
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
