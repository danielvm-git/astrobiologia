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
    And they save the article
    Then the article should be created successfully
