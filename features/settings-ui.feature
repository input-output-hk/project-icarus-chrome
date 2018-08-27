Feature: Wallet UI Settings

  Background:
    Given I have opened the chrome extension
    And I have completed the basic setup

  @it-12
  Scenario Outline: User can't change password if it doesn't meet complexity requirements (IT-12)
    When I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test
    And I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password | repeatedPassword |
    | Secret_123         | secret   | secret           |
    And I submit the wallet password dialog
    Then I should see the following error messages:
    | message                             |
    | global.errors.invalidWalletPassword |

  @it-94
  Scenario: User is able to change spending password (IT-94)
    When I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test
    And I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | Secret_123         | newSecret123 | newSecret123     |
    And I submit the wallet password dialog
    Then I should not see the change password dialog anymore
  
  @it-91
  Scenario: Password should be case-sensitive [Wallet password changing] (IT-91)
    When I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test
    And I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | InvalidPrevious123 | newSecret123 | newSecret123     |
    And I submit the wallet password dialog
    Then I should see the following submit error messages:
    | message                           |
    | api.errors.IncorrectPasswordError |

#@it-91
#  Scenario: User tries to change the password omitting special characters in their current password
#   When I navigate to the general settings screen
#    And I click on secondary menu "wallet" item
#    And I click on the "change" password label
#    And I should see the "change" wallet password dialog
#    And I change wallet password:
#    | currentPassword    | password     | repeatedPassword |
#    | Secret123          | newSecret123 | newSecret123     |
#    And I submit the wallet password dialog
#    Then I should see the following submit error messages:
#    | message                           |
#    | api.errors.IncorrectPasswordError |

  
  @it-8
  Scenario: Wallet renaming (IT-8)
    When I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test
    And I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on "name" input field
    And I enter new wallet name:
    | name         |
    | first Edited |
    And I click outside "name" input field
    And I navigate to wallet transactions screen
    Then I should see new wallet name "first Edited"

  @it-14
  Scenario: User can't change the password without entering old password (IT-14)
    When I am testing "Wallet Settings Screen"
    And There is a wallet stored named Test
    And I navigate to the general settings screen
    And I click on secondary menu "wallet" item
    And I click on the "change" password label
    And I should see the "change" wallet password dialog
    And I change wallet password:
    | currentPassword    | password     | repeatedPassword |
    | Secret_123         | newSecret123 | newSecret123     |
    And I clear the current wallet password Secret_123
    And I submit the wallet password dialog
    Then I should stay in the change password dialog

  @it-2
  Scenario: Change language in General Settings (IT-2)
    Given I am testing "General Settings"
    When There is a wallet stored named Test
    When I navigate to the general settings screen
    And I open General Settings language selection dropdown
    And I select Japanese language
    Then I should see Japanese language as selected

  @it-23
  Scenario: Wallet settings tab isn't active if wallet is not created (IT-23)
    Given I am testing "General Settings"
    When There is no wallet stored
    And I navigate to the general settings screen
    Then I should see secondary menu "wallet" item disabled