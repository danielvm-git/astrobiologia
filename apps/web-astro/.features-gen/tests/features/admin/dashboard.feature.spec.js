// Generated from: tests/features/admin/dashboard.feature
import { test } from "../../../../tests/fixtures/base.fixture.ts";

test.describe("Admin Dashboard", () => {
  test(
    "Dashboard loads with content stats",
    { tag: ["@p0", "@smoke", "@admin"] },
    async ({ Given, When, Then, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin"', null, { page });
      await Then("the dashboard should show stat cards", null, { page });
    }
  );

  test(
    "Novo Artigo quick action navigates to editor",
    { tag: ["@p1", "@admin"] },
    async ({ Given, When, Then, And, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin"', null, { page });
      await And('they click the "Novo Artigo" quick action', null, { page });
      await Then("they should be on the new article page", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/admin/dashboard.feature"),
    { scope: "test", box: true },
  ],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [
  // bdd-data-start
  {
    pwTestLine: 6,
    pickleLine: 7,
    tags: ["@p0", "@smoke", "@admin"],
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
        textWithKeyword: 'When they navigate to "/admin"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin"',
              children: [
                { start: 18, value: "/admin", children: [{ children: [] }] },
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
        textWithKeyword: "Then the dashboard should show stat cards",
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 12,
    pickleLine: 13,
    tags: ["@p1", "@admin"],
    steps: [
      {
        pwStepLine: 13,
        gherkinStepLine: 14,
        keywordType: "Context",
        textWithKeyword: "Given the user is logged in as admin",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 14,
        gherkinStepLine: 15,
        keywordType: "Action",
        textWithKeyword: 'When they navigate to "/admin"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin"',
              children: [
                { start: 18, value: "/admin", children: [{ children: [] }] },
                { children: [{ children: [] }] },
              ],
            },
            parameterTypeName: "string",
          },
        ],
      },
      {
        pwStepLine: 15,
        gherkinStepLine: 16,
        keywordType: "Action",
        textWithKeyword: 'And they click the "Novo Artigo" quick action',
        stepMatchArguments: [
          {
            group: {
              start: 15,
              value: '"Novo Artigo"',
              children: [
                {
                  start: 16,
                  value: "Novo Artigo",
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
        pwStepLine: 16,
        gherkinStepLine: 17,
        keywordType: "Outcome",
        textWithKeyword: "Then they should be on the new article page",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
