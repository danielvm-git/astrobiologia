Feature: Articles
  As a reader
  I want to read detailed science journalism
  So I can learn about astrobiology

  @p0 @smoke
  Scenario: User opens an article
    Given the user navigates to "/artigos"
    When they click on the first article card
    Then they should see the article content
