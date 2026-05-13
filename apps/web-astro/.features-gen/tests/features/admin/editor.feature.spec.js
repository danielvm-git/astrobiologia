// Generated from: tests/features/admin/editor.feature
import { test } from "../../../../tests/fixtures/base.fixture.ts";

test.describe("Admin Article Editor", () => {
  test(
    "Admin creates a new article",
    { tag: ["@p0", "@admin"] },
    async ({ Given, When, Then, And, createdArticleIds, page }) => {
      await Given("the user is logged in as admin", null, { page });
      await When('they navigate to "/admin/artigos/new"', null, { page });
      await And(
        'they fill in the article title with "Novo Artigo de Teste"',
        null,
        { page }
      );
      await And(
        'they write the article content with "Este é o conteúdo do artigo."',
        null,
        { page }
      );
      await And('they select the category "noticias"', null, { page });
      await And("they save the article", null, { createdArticleIds, page });
      await Then("the article should be created successfully", null, { page });
    }
  );
});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: "test", box: true }],
  $uri: [
    ({}, use) => use("tests/features/admin/editor.feature"),
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
        textWithKeyword: 'When they navigate to "/admin/artigos/new"',
        stepMatchArguments: [
          {
            group: {
              start: 17,
              value: '"/admin/artigos/new"',
              children: [
                {
                  start: 18,
                  value: "/admin/artigos/new",
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
        textWithKeyword:
          'And they fill in the article title with "Novo Artigo de Teste"',
        stepMatchArguments: [
          {
            group: {
              start: 36,
              value: '"Novo Artigo de Teste"',
              children: [
                {
                  start: 37,
                  value: "Novo Artigo de Teste",
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
        pwStepLine: 10,
        gherkinStepLine: 11,
        keywordType: "Action",
        textWithKeyword:
          'And they write the article content with "Este é o conteúdo do artigo."',
        stepMatchArguments: [
          {
            group: {
              start: 36,
              value: '"Este é o conteúdo do artigo."',
              children: [
                {
                  start: 37,
                  value: "Este é o conteúdo do artigo.",
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
        keywordType: "Action",
        textWithKeyword: 'And they select the category "noticias"',
        stepMatchArguments: [
          {
            group: {
              start: 25,
              value: '"noticias"',
              children: [
                { start: 26, value: "noticias", children: [{ children: [] }] },
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
        textWithKeyword: "And they save the article",
        stepMatchArguments: [],
      },
      {
        pwStepLine: 13,
        gherkinStepLine: 14,
        keywordType: "Outcome",
        textWithKeyword: "Then the article should be created successfully",
        stepMatchArguments: [],
      },
    ],
  },
]; // bdd-data-end
