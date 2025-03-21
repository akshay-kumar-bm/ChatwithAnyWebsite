from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from urllib.parse import urljoin
from typing import List, Set
import time
from src.config.config import Config

class WebScraperService:
    def __init__(self):
        self.service = Service(ChromeDriverManager().install())
        self.chrome_options = Options()
        for option in Config.CHROME_OPTIONS:
            self.chrome_options.add_argument(option)
            
    def extract_nav_urls(self, homepage_url: str) -> List[str]:
        """Extract navigation URLs from a webpage"""
        nav_urls: Set[str] = set()
        driver = None
        
        try:
            driver = webdriver.Chrome(options=self.chrome_options, service=self.service)
            driver.set_page_load_timeout(20)
            driver.get(homepage_url)
            nav_urls.add(homepage_url)
            
            wait = WebDriverWait(driver, 10)
            wait.until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
            time.sleep(2)
            
            nav_elements = driver.find_elements(By.CSS_SELECTOR, 
                'nav, header, [class*="nav"], [class*="menu"], [id*="nav"], [id*="menu"]')
            
            for nav in nav_elements:
                links = nav.find_elements(By.TAG_NAME, 'a')
                for link in links:
                    try:
                        href = link.get_attribute('href')
                        if href and href.startswith('http') and '#' not in href:
                            nav_urls.add(urljoin(homepage_url, href))
                    except Exception:
                        continue
                        
            return list(nav_urls)
        except Exception as e:
            raise Exception(f"Error extracting navigation URLs: {str(e)}")
        finally:
            if driver:
                driver.quit() 