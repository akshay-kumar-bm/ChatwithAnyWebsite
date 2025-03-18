from flask import Flask, request, jsonify
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from urllib.parse import urljoin
from typing import List, Dict
import time
import os
from dotenv import load_dotenv
from pydantic import BaseModel, Field, AnyUrl
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
# from langchain.vectorstores import FAISS
from langchain_community.vectorstores import FAISS  # Updated import

from langchain_community.document_loaders import UnstructuredURLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage
from functools import reduce
from dataclasses import dataclass
from typing import Optional
from langchain_core.documents.base import Document
from flask_cors import CORS

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL = os.getenv("MODEL")

app = Flask(__name__)
CORS(app)

# Initialize LLM and embeddings
llm = ChatGoogleGenerativeAI(model=MODEL)
embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")

# Pydantic models
class UrlClassify(BaseModel):
    desc_urls: List[AnyUrl]
    product_service_urls: List[AnyUrl]

class ProductService(BaseModel):
    name: str = Field(None, title="Product Name")
    description: str = Field(None, title="Product Description")
    price: float = Field(None, title="Product Price")
    specifications: str = Field(None, title="Product Specifications")
    features: str = Field(None, title="Product Features")

class List_product(BaseModel):
    products: List[ProductService]

class SelectRetriverRatio(BaseModel):
    ratio: float

# Utility function for URL extraction
def extract_nav_urls(homepage_url: str) -> List[str]:
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1920,1080')
    chrome_options.add_argument('--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    nav_urls = set()
    driver = None
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.set_page_load_timeout(20)
        driver.get(homepage_url)
        
        wait = WebDriverWait(driver, 10)
        wait.until(EC.presence_of_element_located((By.TAG_NAME, 'body')))
        time.sleep(2)
        nav_urls.add(homepage_url)
        
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

# Initialize classifiers
web_classifier = llm.with_structured_output(UrlClassify)
retriever_selector = llm.with_structured_output(SelectRetriverRatio)
prod_format_llm = llm.with_structured_output(List_product)

# def serialize_url_classify(url_classify: UrlClassify) -> dict:
#     """Convert UrlClassify object to JSON serializable dictionary"""
#     return {
#         'desc_urls': [str(url) for url in url_classify.desc_urls],
#         'product_service_urls': [str(url) for url in url_classify.product_service_urls]
#     }


# Routes
# @app.route('/extract-urls', methods=['POST'])
# def extract_urls():
#     try:
#         data = request.get_json()
#         url = data.get('url')
#         if not url:
#             return jsonify({'error': 'URL is required'}), 400
            
#         nav_urls = extract_nav_urls(url)
#         classified_urls = web_classifier.invoke(str(nav_urls))
        
#         # Serialize the response
#         response_data = serialize_url_classify(classified_urls)
#         return jsonify(response_data)
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    

@app.route('/update-url-classification', methods=['POST'])
def update_url_classification():
    try:
        data = request.get_json()
        url = data.get('url')
        target_class = data.get('target_class')
        
        if not url or not target_class:
            return jsonify({'error': 'URL and target class are required'}), 400
            
        if target_class not in ['desc_urls', 'product_service_urls']:
            return jsonify({'error': 'Invalid target class'}), 400
            
        # Here you would update your classification storage
        # For now, we'll just return success
        return jsonify({'message': 'Classification updated successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-desc-urls', methods=['POST'])
def process_desc_urls():
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({'error': 'URLs are required'}), 400
            
        desc_loader = UnstructuredURLLoader(urls=urls)
        desc_data = desc_loader.load()
        
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        final_desc_data = splitter.split_documents(desc_data)
        
        # Create and save vector store
        desc_vectorstore = FAISS.from_documents(
            documents=final_desc_data,
            embedding=embeddings
        )
        desc_vectorstore.save_local("vectors/description_index")
        
        return jsonify({'message': 'Description URLs processed successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/process-product-urls', methods=['POST'])
def process_product_urls():
    try:
        data = request.get_json()
        urls = data.get('urls', [])
        
        if not urls:
            return jsonify({'error': 'URLs are required'}), 400
            
        prod_loader = UnstructuredURLLoader(urls=urls)
        prod_data = prod_loader.load()
        
        splitter = RecursiveCharacterTextSplitter(chunk_size=2000, chunk_overlap=100)
        final_prod_data = splitter.split_documents(prod_data)
        
        product_info = []
        for docs in final_prod_data[:10]:
            product_info.append(prod_format_llm.invoke(docs.page_content))
            
        result = reduce(lambda x, y: List_product(products=x.products + y.products), product_info)
        
        return jsonify({'products': [dict(prod) for prod in result.products]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# def initialize_vector_store(store_name: str):
#     """Initialize vector store if it doesn't exist"""
#     store_path = f"vectors/{store_name}"
#     if not os.path.exists(store_path):
#         # Create an empty document to initialize the store
#         empty_doc = Document(
#             page_content="Initialization document",
#             metadata={"type": "init"}
#         )
#         vector_store = FAISS.from_documents(
#             documents=[empty_doc],
#             embedding=embeddings
#         )
#         vector_store.save_local(store_path)
#     return FAISS.load_local(store_path, embeddings, allow_dangerous_deserialization=True)

def initialize_vector_stores():
    """Initialize vector stores if they don't exist"""
    os.makedirs('vectors', exist_ok=True)
    
    for store_name in ["product_info_index", "description_index"]:
        store_path = f"vectors/{store_name}"
        if not os.path.exists(store_path):
            # Create an empty document to initialize the store
            empty_doc = Document(
                page_content="Initialization document",
                metadata={"type": "init"}
            )
            vector_store = FAISS.from_documents(
                documents=[empty_doc],
                embedding=embeddings
            )
            vector_store.save_local(store_path)

def serialize_url_classify(url_classify: UrlClassify) -> dict:
    """Convert UrlClassify object to JSON serializable dictionary"""
    return {
        'desc_urls': [str(url) for url in url_classify.desc_urls],
        'product_service_urls': [str(url) for url in url_classify.product_service_urls]
    }

# @app.route('/update-product', methods=['POST'])
# def update_product():
#     try:
#         data = request.get_json()
#         product = ProductService(**data)
        
#         # Convert product to document
#         doc = Document(
#             page_content=str(dict(product)),
#             metadata={"type": "product"}
#         )
        
#         try:
#             # Try to load existing vector store
#             product_vectorstore = FAISS.load_local(
#                 "vectors/product_info_index", 
#                 embeddings,
#                 allow_dangerous_deserialization=True
#             )
#         except Exception:
#             # If loading fails, initialize new vector store
#             product_vectorstore = initialize_vector_store("product_info_index")
        
#         # Add new document to vector store
#         product_vectorstore.add_documents([doc])
#         product_vectorstore.save_local("vectors/product_info_index")
        
#         return jsonify({
#             'message': 'Product updated successfully',
#             'product': dict(product)
#         })
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

@app.route('/extract-urls', methods=['POST'])
def extract_urls():
    try:
        data = request.get_json()
        url = data.get('url')
        if not url:
            return jsonify({'error': 'URL is required'}), 400
            
        nav_urls = extract_nav_urls(url)
        classified_urls = web_classifier.invoke(str(nav_urls))
        
        response_data = serialize_url_classify(classified_urls)
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/update-product', methods=['POST'])
def update_product():
    try:
        data = request.get_json()
        product = ProductService(**data)
        
        # Convert product to document
        doc = Document(
            page_content=str(dict(product)),
            metadata={"type": "product"}
        )
        
        try:
            # Try to load existing vector store
            product_vectorstore = FAISS.load_local(
                "vectors/product_info_index", 
                embeddings,
                allow_dangerous_deserialization=True
            )
        except Exception:
            # If loading fails, initialize new vector store
            empty_doc = Document(
                page_content="Initialization document",
                metadata={"type": "init"}
            )
            product_vectorstore = FAISS.from_documents(
                documents=[empty_doc],
                embedding=embeddings
            )
        
        # Add new document to vector store
        product_vectorstore.add_documents([doc])
        product_vectorstore.save_local("vectors/product_info_index")
        
        return jsonify({
            'message': 'Product updated successfully',
            'product': dict(product)
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# Update the app initialization to ensure vectors directory exists
# @app.before_first_request
# def setup_vector_stores():
#     """Ensure vector stores are initialized before first request"""
#     os.makedirs('vectors', exist_ok=True)
#     try:
#         initialize_vector_store("product_info_index")
#         initialize_vector_store("description_index")
#     except Exception as e:
#         print(f"Warning: Could not initialize vector stores: {e}")

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        query = data.get('query')
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
            
        # Get ratio for retriever selection
        ratio = retriever_selector.invoke(query).ratio
        
        # Load vector stores
        prod_vector = FAISS.load_local(
            "vectors/product_info_index", 
            embeddings,
            allow_dangerous_deserialization=True
        )
        desc_vector = FAISS.load_local(
            "vectors/description_index", 
            embeddings,
            allow_dangerous_deserialization=True
        )
        
        # Calculate number of documents to retrieve from each store
        num_desc_docs = int((1 - ratio) * 10)
        num_prod_docs = 10 - num_desc_docs
        
        # Retrieve documents
        desc_docs = desc_vector.as_retriever().get_relevant_documents(query)[:num_desc_docs]
        prod_docs = prod_vector.as_retriever().get_relevant_documents(query)[:num_prod_docs]
        
        documents = desc_docs + prod_docs
        
        # Create prompt and get response
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "Act as Customer Support Manager"),
            ("user", "Your task is to respond to the following customer query: {query}\n"
                    "Provide the most relevant information based on the query and keep the message on point with markdown formate.\n"
                    "You have access to the following documents: {documents}")
        ])
        
        chain = prompt_template | llm
        response = chain.invoke({"query": query, "documents": documents})
        
        return jsonify({'response': response.content})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Create vectors directory if it doesn't exist

    os.makedirs('vectors', exist_ok=True)
    initialize_vector_stores()

    app.run(debug=True)