Feature: Admin Translation Flow
  As an admin
  I want to translate articles into multiple languages
  So I can reach a global audience

  @p0 @admin @translation
  Scenario: Admin translates an article to English
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they click "Traduzir com DeepL"
    Then the "English" title and content should be populated
    When they save the translation
    Then the "English" version should be accessible at its slug

  @p1 @admin @translation
  Scenario: Admin saves translation with empty content
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they clear the translation content
    And they save the translation
    Then they should see a validation error

  @p1 @admin @translation
  Scenario: Translation to same language shows duplicate warning
    Given the user is logged in as admin
    And they are editing an existing article with a Portuguese translation
    When they try to create another Portuguese translation
    Then they should see a duplicate warning
