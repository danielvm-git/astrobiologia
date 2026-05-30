Feature: Admin Translation Flow
  As an admin
  I want to translate articles into multiple languages
  So I can reach a global audience

  @p0 @admin @translation
  Scenario: Admin saves manual English translation
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they fill in the English translation title with "English Test Title"
    And they write the English translation content with "English test content for E2E."
    And they save the translation
    Then the "English" version should be accessible at its slug

  @deepl @p2 @admin @translation
  Scenario: Admin translates an article to English via DeepL
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they click "Traduzir com DeepL"
    Then the "English" title and content should be populated
    When they save the translation
    Then the "English" version should be accessible at its slug

  @p1 @admin @translation
  Scenario: Admin saves after clearing optional locale content
    Given the user is logged in as admin
    And they are editing an existing article
    When they click the "EN" translation tab
    And they clear the translation content
    And they save the translation
    Then the article should be updated successfully
