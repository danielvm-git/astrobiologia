Feature: Homepage
  As a visitor
  I want to see the latest astrobiology news
  So I can stay informed

  @p0 @smoke
  Scenario: Homepage loads correctly
    Given the user is on the homepage
    Then the page title should contain "Astrobiologia"
    And I should see the main navigation
    And I should see at least one article card

  @p1 @isolated
  Scenario: Homepage loads with no articles
    Given no articles are published
    When they navigate to "/"
    Then the page title should contain "Astrobiologia"
    And I should see an empty state message
