from dataclasses import dataclass

@dataclass
class ForecastAssumption:
    """
    Schema detailing a business rule assumption implicitly or explicitly used in the forecast run.
    """
    name: str
    value: str
    category: str  # e.g., Credit, Debt, Recurring, Buffer
    importance: str  # High, Medium, Low
    modifiable: bool  # Can the user override this assumption
