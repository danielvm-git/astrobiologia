// Generated from: tests/features/admin/settings.feature
import { test } from "../../../../tests/fixtures/base.fixture.ts";

test.describe("Admin Settings", () => {
  test(
    "Theme preference persists across page reload",
    { tag: ["@p0", "@admin"] },
    async ({ Given, When, Then, And, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin/configuracoes"', null, { page });
      await And('they select the "dark" theme', null, { page });
      await And("they reload the page", null, { page });
      await Then('the "dark" theme radio should be selected', null, { page });
    }
  );

  test(
    "Admin can update account password",
    { tag: ["@p1", "@admin"] },
    async ({ Given, When, Then, And, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin/configuracoes"', null, { page });
      await And("they fill in the account password form", null, { page });
      await And("they save the account settings", null, { page });
      await Then("they should see a success toast", null, { page });
    }
  );

  test(
    "Site metadata can be saved",
    { tag: ["@p1", "@admin", "@migration-pending"] },
    async ({ Given, When, Then, And, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin/configuracoes"', null, { page });
      await And("they fill in the site metadata", null, { page });
      await And("they save the site metadata", null, { page });
      await Then("they should see a success toast", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/admin/settings.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p0", "@admin"],
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
        keywordType: "Action",
        textWithKeyword: 'When they navigate to "/admin/configuracoes"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin/configuracoes"',
              children: [
                {
                  start: 18,
                  value: "/admin/configuracoes",
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
        keywordType: "Action",
        textWithKeyword: 'And they select the "dark" theme',
        stepMatchArguments: [
          {
            group: {
              start: 16,
              value: '"dark"',
              children: [
                { start: 17, value: "dark", children: [{ children: [] }] },
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
        textWithKeyword: "And they reload the page",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 11,
        gherkinStepLine: 12,
        keywordType: "Outcome",
        textWithKeyword: 'Then the "dark" theme radio should be selected',
        stepMatchArguments: [
          {
            group: {
              start: 4,
              value: '"dark"',
              children: [
                { start: 5, value: "dark", children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
    ],
  },
  {
    pwTestLine: 14,
    pickleLine: 15,
    tags: ["@p1", "@admin"],
    steps: [
      {
        pwStepLine: 15,
        gherkinStepLine: 16,
        keywordType: "Context",
        textWithKeyword: "Given the user is logged in as admin",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 16,
        gherkinStepLine: 17,
        keywordType: "Action",
        textWithKeyword: 'When they navigate to "/admin/configuracoes"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin/configuracoes"',
              children: [
                {
                  start: 18,
                  value: "/admin/configuracoes",
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
        pwStepLine: 17,
        gherkinStepLine: 18,
        keywordType: "Action",
        textWithKeyword: "And they fill in the account password form",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 18,
        gherkinStepLine: 19,
        keywordType: "Action",
        textWithKeyword: "And they save the account settings",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 19,
        gherkinStepLine: 20,
        keywordType: "Outcome",
        textWithKeyword: "Then they should see a success toast",
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 22,
    pickleLine: 23,
    tags: ["@p1", "@admin", "@migration-pending"],
    steps: [
      {
        pwStepLine: 23,
        gherkinStepLine: 24,
        keywordType: "Context",
        textWithKeyword: "Given the user is logged in as admin",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 24,
        gherkinStepLine: 25,
        keywordType: "Action",
        textWithKeyword: 'When they navigate to "/admin/configuracoes"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin/configuracoes"',
              children: [
                {
                  start: 18,
                  value: "/admin/configuracoes",
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
        pwStepLine: 25,
        gherkinStepLine: 26,
        keywordType: "Action",
        textWithKeyword: "And they fill in the site metadata",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 26,
        gherkinStepLine: 27,
        keywordType: "Action",
        textWithKeyword: "And they save the site metadata",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 27,
        gherkinStepLine: 28,
        keywordType: "Outcome",
        textWithKeyword: "Then they should see a success toast",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
