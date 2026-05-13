// Generated from: tests/features/admin/auth.feature
import { test } from "../../../../tests/fixtures/base.fixture.ts";

test.describe("Admin Authentication", () => {
  test(
    "Valid credentials redirect to dashboard",
    { tag: ["@p0", "@smoke"] },
    async ({ Given, When, Then, page }) => {
      await Given('the user navigates to "/admin/login"', null, { page });
      await Then("the login form should be visible", null, { page });
      await When("they submit the login form with valid credentials", null, {
        page,
      });
      await Then("they should be redirected to the admin dashboard", null, {
        page,
      });
    }
  );

  test(
    "Invalid credentials show an error",
    { tag: ["@p1"] },
    async ({ Given, When, Then, page }) => {
      await Given('the user navigates to "/admin/login"', null, { page });
      await When("they submit the login form with invalid credentials", null, {
        page,
      });
      await Then("they should see a login error", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/admin/auth.feature"),
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
        textWithKeyword: 'Given the user navigates to "/admin/login"',
        stepMatchArguments: [
          {
            group: {
              start: 22,
              value: '"/admin/login"',
              children: [
                {
                  start: 23,
                  value: "/admin/login",
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
        textWithKeyword: "Then the login form should be visible",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 9,
        gherkinStepLine: 10,
        keywordType: "Action",
        textWithKeyword:
          "When they submit the login form with valid credentials",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 10,
        gherkinStepLine: 11,
        keywordType: "Outcome",
        textWithKeyword:
          "Then they should be redirected to the admin dashboard",
        stepMatchArguments: [],
      },
    ],
  },
  {
    pwTestLine: 13,
    pickleLine: 14,
    tags: ["@p1"],
    steps: [
      {
        pwStepLine: 14,
        gherkinStepLine: 15,
        keywordType: "Context",
        textWithKeyword: 'Given the user navigates to "/admin/login"',
        stepMatchArguments: [
          {
            group: {
              start: 22,
              value: '"/admin/login"',
              children: [
                {
                  start: 23,
                  value: "/admin/login",
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
        pwStepLine: 15,
        gherkinStepLine: 16,
        keywordType: "Action",
        textWithKeyword:
          "When they submit the login form with invalid credentials",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 16,
        gherkinStepLine: 17,
        keywordType: "Outcome",
        textWithKeyword: "Then they should see a login error",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
