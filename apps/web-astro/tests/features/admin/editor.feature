Feature: Admin Article Editor
  As an admin
  I want to manage site content
  So I can keep the information up to date

  @p0 @admin
  Scenario: Admin creates a new article
    Given the user is logged in as admin
    When they navigate to "/admin/artigos/new"
    And they fill in the article title with "Novo Artigo de Teste"
    And they write the article content with "Este é o conteúdo do artigo."
    And they select the category "noticias"
    And they set the article status to "publicado"
    And they save the article
    Then the article should be created successfully

  @p1 @admin
  Scenario: Admin saves article with missing required fields
    Given the user is logged in as admin
    When they navigate to "/admin/artigos/new"
    And they save the article without filling in the title
    Then they should see a validation error for the title field

  @p1 @admin
  Scenario: Admin edits an existing article
    Given the user is logged in as admin
    And an existing article exists
    When they navigate to edit the article
    And they update the article title with "Updated Title"
    And they save the article
    Then the article should be updated successfully
