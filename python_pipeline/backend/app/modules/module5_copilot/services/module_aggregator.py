from typing import Dict, Any, List

class ModuleAggregator:
    """
    Helper component that combines context blocks into a unified structure.
    Ensures zero calculations are performed inside Module 5.
    """

    def aggregate_context(self, context_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        aggregated = {
            "aggregated_timestamp": "",
            "metrics": {}
        }
        
        for block in context_blocks:
            if "modules" in block:
                for mod_name, mod_data in block["modules"].items():
                    aggregated["metrics"][mod_name] = mod_data

        return aggregated
