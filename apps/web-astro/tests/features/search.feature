Feature: Search
  As a reader
  I want to search for specific topics
  So I can find relevant content quickly

  @p1
  Scenario: User searches for an article
    Given the user navigates to "/busca"
    When they search for "exoplaneta"
    Then they should see relevant results

  @p1
  Scenario: Search with no results
    Given the user navigates to "/busca"
    When they search for "xyznonexistent12345"
    Then they should see a no-results message

  @p1
  Scenario: Search with empty query
    Given the user navigates to "/busca"
    When they search for ""
    Then they should see a validation prompt or all articles
