Feature: Articles
  As a reader
  I want to read detailed science journalism
  So I can learn about astrobiology

  @p0 @smoke
  Scenario: User opens an article
    Given the user navigates to "/artigos"
    When they click on the first article card
    Then they should see the article content

  @p1
  Scenario: User navigates to a non-existent article
    Given the user navigates to "/artigos/this-slug-does-not-exist-xyz"
    Then they should see a not-found message

  @p1
  Scenario: Article list is empty
    Given the user navigates to "/artigos"
    And no articles are published
    Then they should see an empty state message
