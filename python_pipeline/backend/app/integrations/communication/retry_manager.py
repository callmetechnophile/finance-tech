import asyncio
import logging
import random
from typing import Callable, Any, Awaitable

logger = logging.getLogger(__name__)

class RetryManager:
    """
    Implements exponential backoff retry policies for calling external APIs.
    """

    def __init__(self, max_retries: int = 3, base_delay: float = 1.0, disable_sleep: bool = False):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.disable_sleep = disable_sleep

    async def execute_with_retry(self, func: Callable[[], Awaitable[Any]], *args, **kwargs) -> Any:
        """
        Executes an async function, catching exceptions and retrying with exponential backoff.
        """
        attempt = 0
        while True:
            try:
                return await func(*args, **kwargs)
            except Exception as e:
                attempt += 1
                if attempt > self.max_retries:
                    logger.error(f"Retry limit ({self.max_retries}) reached. Final error: {str(e)}")
                    raise e
                
                # Compute exponential backoff delay with jitter
                delay = self.base_delay * (2 ** (attempt - 1)) + random.uniform(0.0, 0.5)
                logger.warning(
                    f"Transient API failure: {str(e)}. Attempt {attempt}/{self.max_retries}. "
                    f"Retrying in {0 if self.disable_sleep else delay:.2f} seconds..."
                )
                
                if not self.disable_sleep:
                    await asyncio.sleep(delay)
