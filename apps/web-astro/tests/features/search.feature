Feature: Search
  As a reader
  I want to search for specific topics
  So I can find relevant content quickly

  @p1
  Scenario: User searches for an article
    Given the user navigates to "/busca"
    When they search for "exoplaneta"
    Then they should see relevant results
