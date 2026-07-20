import time
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request
from app.utils.logger import logger


class LoggingMiddleware(BaseHTTPMiddleware):
    """Logs request execution timing and HTTP status metrics."""
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time_ms = round((time.time() - start_time) * 1000, 2)
        
        response.headers["X-Process-Time-MS"] = str(process_time_ms)
        
        logger.info(
            f"{request.method} {request.url.path} - {response.status_code} ({process_time_ms}ms)"
        )
        return response
