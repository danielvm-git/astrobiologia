Feature: Admin Authentication
  As an admin
  I want to securely access the admin panel
  So I can manage site content

  @p0 @admin
  Scenario: Valid credentials redirect to dashboard
    Given the user navigates to "/admin/login"
    Then the login form should be visible
    When they submit the login form with valid credentials
    Then they should be redirected to the admin dashboard

  @p1
  Scenario: Invalid credentials show an error
    Given the user navigates to "/admin/login"
    When they submit the login form with invalid credentials
    Then they should see a login error

  @p1
  Scenario: Admin logout redirects to homepage
    Given the user is logged in as admin
    When they click the logout button
    Then they should be redirected to the homepage
    And the page should show the homepage hero
