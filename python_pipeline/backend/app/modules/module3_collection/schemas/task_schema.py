from dataclasses import dataclass, field
from typing import List

@dataclass
class CollectionTask:
    """
    Schema for internal workflow task generation items.
    """
    task_id: str
    priority: str       # High, Medium, Low
    owner: str          # Account Manager, Finance Manager, Legal Counsel
    title: str          # Call Customer, Verify Contacts, Prepare Legal Documents, etc.
    due_date: str
    status: str         # PENDING, COMPLETED, CANCELLED
    dependencies: List[str] = field(default_factory=list)
