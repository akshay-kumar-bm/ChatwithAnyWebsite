import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
    MODEL = os.getenv("MODEL")
    VECTOR_STORE_PATH = "vectors"
    PRODUCT_INDEX_NAME = "product_info_index"
    DESCRIPTION_INDEX_NAME = "description_index"
    
    # Chrome options
    CHROME_OPTIONS = [
        '--headless',
        '--disable-gpu',
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--window-size=1920,1080',
        '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    ]
    
    # Vector store settings
    MAX_SEARCH_RESULTS = 100
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 100
    PRODUCT_CHUNK_SIZE = 5000
    PRODUCT_CHUNK_OVERLAP = 0 