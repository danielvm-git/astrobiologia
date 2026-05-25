Feature: Admin Settings
  As an admin
  I want to configure site settings
  So I can customize the site behavior and appearance

  @p0 @admin
  Scenario: Theme preference persists across page reload
    Given the user is logged in as admin
    When they navigate to "/admin/configuracoes"
    And they select the "dark" theme
    And they reload the page
    Then the "dark" theme radio should be selected

  @p1 @admin
  Scenario: Admin can update account password
    Given the user is logged in as admin
    When they navigate to "/admin/configuracoes"
    And they fill in the account password form
    And they save the account settings
    Then they should see a success toast

  @p1 @admin @wip
  Scenario: Site metadata can be saved
    Given the user is logged in as admin
    When they navigate to "/admin/configuracoes"
    And they fill in the site metadata
    And they save the site metadata
    Then they should see a success toast

  @p1 @admin
  Scenario: Password update with mismatched confirmation fails
    Given the user is logged in as admin
    When they navigate to "/admin/configuracoes"
    And they fill in the password form with mismatched confirmation
    And they save the account settings
    Then they should see a password mismatch error
