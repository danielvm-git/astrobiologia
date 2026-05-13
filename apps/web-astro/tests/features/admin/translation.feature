Feature: Admin Translation Flow
  As an admin
  I want to translate articles into multiple languages
  So I can reach a global audience

  @p0 @admin @translation @migration-pending
  Scenario: Admin translates an article to English
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they click "Traduzir com DeepL"
    Then the "English" title and content should be populated
    When they save the translation
    Then the "English" version should be accessible at its slug
