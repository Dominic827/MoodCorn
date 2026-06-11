import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from .config import get_settings

log = logging.getLogger("database")

client: AsyncIOMotorClient = None
database: AsyncIOMotorDatabase = None


async def connect_to_mongo() -> None:
    global client, database
    settings = get_settings()
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    database = client[settings.DATABASE_NAME]

    # Ensure indexes exist
    await database.movies.create_index("imdb_id", unique=True)
    await database.movies.create_index("type")
    await database.movies.create_index("rating")
    await database.movies.create_index("votes")
    await database.movies.create_index("year")

    log.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")


async def close_mongo_connection() -> None:
    global client
    if client:
        client.close()
        log.info("MongoDB connection closed.")


async def get_database() -> AsyncIOMotorDatabase:
    return database
