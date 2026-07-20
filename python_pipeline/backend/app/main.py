from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from app.config import settings
from app.api.v1.router import api_router
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.logging import LoggingMiddleware
from app.utils.exceptions import global_exception_handler
from app.utils.logger import logger
from app.database.init_db import init_db

# App Initialization
app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="FORGE-PATH Financial Operations Platform API - Final Hackathon Integration.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Middleware Stack
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(LoggingMiddleware)
app.add_middleware(RequestIDMiddleware)

# Global Exception Handling
app.add_exception_handler(Exception, global_exception_handler)

# Versioned API Routers (/api/v1)
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", status_code=status.HTTP_200_OK, tags=["Health"])
async def root_health_check():
    """Root health check endpoint for load balancers & container readiness probes."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


@app.on_event("startup")
async def startup_event():
    # Initialize database & seed demo data
    init_db()
    logger.info(f"🚀 {settings.APP_NAME} started successfully on {settings.APP_ENV} environment.")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
