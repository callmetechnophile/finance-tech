from typing import List
from app.modules.module2_liquidity.schemas.stress_schema import StressScenarioInput

class StressTestingEngine:
    """
    Builds the standard stress scenario inputs to run against the simulator.
    """

    def get_standard_scenarios(self) -> List[StressScenarioInput]:
        return [
            # 1. Customer Payment Delays
            StressScenarioInput(
                scenario_name="Customer Delays Payment (+7d)",
                cash_adjustment=0.0,
                receivables_delay_days=7,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Customer Delays Payment (+15d)",
                cash_adjustment=0.0,
                receivables_delay_days=15,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Customer Delays Payment (+30d)",
                cash_adjustment=0.0,
                receivables_delay_days=30,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Customer Delays Payment (+60d)",
                cash_adjustment=0.0,
                receivables_delay_days=60,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),

            # 2. Vendor Cost Increases
            StressScenarioInput(
                scenario_name="Vendor Price Increase (+5%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.05,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Vendor Price Increase (+10%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.10,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Vendor Price Increase (+20%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.20,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),

            # 3. Operations cost shocks
            StressScenarioInput(
                scenario_name="Unexpected Machine Maintenance",
                cash_adjustment=-5000.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Payroll Cost Increase (+15%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.15
            ),
            StressScenarioInput(
                scenario_name="Utility Cost Increase (+10%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.10
            ),
            StressScenarioInput(
                scenario_name="GST Payment Settlement Outflow",
                cash_adjustment=-8000.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Loan EMI cost shock (+5%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.05
            ),

            # 4. Revenue changes
            StressScenarioInput(
                scenario_name="Revenue Drop (-10%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=0.90,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Revenue Drop (-20%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=0.80,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Revenue Drop (-40%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=0.60,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Revenue Increase (+10%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.10,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Revenue Increase (+20%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.20,
                recurring_expense_multiplier=1.0
            ),

            # 5. Accounts shifts
            StressScenarioInput(
                scenario_name="New Customer Retainer Acquired",
                cash_adjustment=15000.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Large Customer Account Loss (-30%)",
                cash_adjustment=0.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=0.70,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Emergency Supply Purchase",
                cash_adjustment=-6000.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            ),
            StressScenarioInput(
                scenario_name="Emergency Inventory Spike",
                cash_adjustment=-4000.0,
                receivables_delay_days=0,
                payables_cost_multiplier=1.0,
                revenue_multiplier=1.0,
                recurring_expense_multiplier=1.0
            )
        ]
