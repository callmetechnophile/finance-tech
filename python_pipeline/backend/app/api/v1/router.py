from fastapi import APIRouter
from app.routers import health, auth, documents, forecast, liquidity, collections, treasury, copilot, dashboard

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(documents.router)
api_router.include_router(forecast.router)
api_router.include_router(liquidity.router)
api_router.include_router(collections.router)
api_router.include_router(treasury.router)
api_router.include_router(copilot.router)
api_router.include_router(dashboard.router)
