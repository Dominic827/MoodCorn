from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    MONGODB_URI: str
    TMDB_API_KEY: str = ""
    FRONTEND_URL: str = "http://localhost:5173"
    GITHUB_URL: str = "https://github.com/yourusername/moodcorn"
    DATABASE_NAME: str = "moodcorn"
    PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
