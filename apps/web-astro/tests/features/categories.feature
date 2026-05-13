Feature: Categories
  As a reader
  I want to browse articles by category
  So I can focus on my areas of interest

  @p1
  Scenario: User browses a category
    Given the user navigates to "/categorias/noticias"
    Then they should see articles for the "noticias" category
