Feature: Categories
  As a reader
  I want to browse articles by category
  So I can focus on my areas of interest

  @p1
  Scenario: User browses a category
    Given the user navigates to "/categorias/noticias"
    Then they should see articles for the "noticias" category

  @p1
  Scenario: User browses a non-existent category
    Given the user navigates to "/categorias/this-category-does-not-exist"
    Then they should see a not-found or empty state message

  @p1
  Scenario: Category exists but has no articles
    Given the user navigates to "/categorias/analises"
    And the "analises" category has no published articles
    Then they should see an empty state message
