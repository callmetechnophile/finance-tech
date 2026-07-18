from dataclasses import dataclass, field
from typing import List, Dict, Any
from app.modules.module3_collection.schemas.invoice_context_schema import InvoiceContext
from app.modules.module3_collection.schemas.customer_profile_schema import CustomerFinancialProfile
from app.modules.module3_collection.schemas.collection_risk_schema import CollectionRisk

@dataclass
class CollectionIntelligenceReport:
    """
    Schema representing the complete collection intelligence assessment for a single invoice.
    """
    company_id: str
    generated_timestamp: str
    invoice_id: str
    customer_profile: CustomerFinancialProfile
    invoice_context: InvoiceContext
    priority_score: float
    priority_level: str
    collection_risk: CollectionRisk
    collection_probability: float
    expected_collection_days: int
    ranking_position: int
    reason_codes: List[str] = field(default_factory=list)
    supporting_metrics: Dict[str, Any] = field(default_factory=dict)
