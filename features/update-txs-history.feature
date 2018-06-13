Feature: Update Txs History

  Scenario: Update Txs History
    Given I have opened the chrome extension
      And There is a wallet stored with 25 addresses
    When I see the balance
    Then I should see the balance number "0.000295"