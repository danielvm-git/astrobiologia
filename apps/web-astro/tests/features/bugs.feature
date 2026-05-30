@p1 @admin @isolated
Feature: Bug Regressions

  Scenario: CJK titles should generate a fallback slug instead of remaining empty
    Given the user is logged in as admin
    When they navigate to "/admin/artigos/new"
    And they fill in the article title with "宇宙生物学"
    Then the article slug should not be empty
