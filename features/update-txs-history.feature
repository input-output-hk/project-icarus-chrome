Feature: Update Txs History

  Scenario: Update Txs History: Summary
    Given I have opened the chrome extension
      And There is a wallet stored with 25 addresses starting with "B1sy6PwUPEZASB8nPKk1VsePbQZY8ZVv4mGebJ4UwmSBhRo9oR9EqkSzxo"
    When I see the transactions summary
    Then I should see that the number of transactions is 2
    And I should see the information

  # TODO: Make tests for:
  #   - existing / non-existing txs in lovefield db
  #   - addresses amounts: <20, >20 and <40, >40
  #   - txs amounts: <20, >20 and <40, >40