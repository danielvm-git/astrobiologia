Feature: Admin Dashboard
  As an admin
  I want to see the site overview on the dashboard
  So I can quickly understand the content status

  @p0 @smoke @admin
  Scenario: Dashboard loads with content stats
    Given the user is logged in as admin
    When they navigate to "/admin"
    Then the dashboard should show stat cards

  @p1 @admin
  Scenario: Novo Artigo quick action navigates to editor
    Given the user is logged in as admin
    When they navigate to "/admin"
    And they click the "Novo Artigo" quick action
    Then they should be on the new article page

  @p1 @admin
  Scenario: Unauthenticated user is redirected to login
    Given the user is not logged in
    When they navigate to "/admin"
    Then they should be redirected to "/admin/login"
