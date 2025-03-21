import time
from typing import List, Dict, Any, Optional
from langchain_core.documents.base import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import UnstructuredURLLoader
from src.config.config import Config
from src.services.vector_store import VectorStoreService
from src.services.web_scraper import WebScraperService
from src.services.llm_service import LLMService
from src.models.data_models import ProductService

class MainService:
    def __init__(self):
        self.vector_store = VectorStoreService()
        self.web_scraper = WebScraperService()
        self.llm_service = LLMService()
        
    def extract_and_classify_urls(self, url: str) -> Dict[str, List[str]]:
        """Extract and classify URLs from a webpage"""
        nav_urls = self.web_scraper.extract_nav_urls(url)
        classified_urls = self.llm_service.classify_urls(nav_urls)
        return {
            'desc_urls': [str(url) for url in classified_urls.desc_urls],
            'product_service_urls': [str(url) for url in classified_urls.product_service_urls]
        }
        
    def process_description_urls(self, urls: List[str]) -> None:
        """Process and store description URLs"""
        desc_loader = UnstructuredURLLoader(urls=urls)
        desc_data = desc_loader.load()
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        final_desc_data = splitter.split_documents(desc_data)
        
        self.vector_store.add_documents(final_desc_data, Config.DESCRIPTION_INDEX_NAME)
        
    def process_product_urls(self, urls: List[str]) -> List[Dict]:
        """Process and store product URLs"""
        prod_loader = UnstructuredURLLoader(urls=urls)
        prod_data = prod_loader.load()
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.PRODUCT_CHUNK_SIZE,
            chunk_overlap=Config.PRODUCT_CHUNK_OVERLAP
        )
        final_prod_data = splitter.split_documents(prod_data)
        
        products = []
        for docs in final_prod_data[:10]:  # Limit to first 10 chunks
            product_info = self.llm_service.format_product_info(docs.page_content)
            products.extend([dict(prod) for prod in product_info.products])
            
        # Store products in vector store
        product_docs = [
            Document(
                page_content=str(prod),
                metadata={"type": "product", "doc_id": str(time.time())}
            )
            for prod in products
        ]
        self.vector_store.add_documents(product_docs, Config.PRODUCT_INDEX_NAME)
        
        return products
        
    def process_description_text(self, text: str) -> None:
        """Process and store description text"""
        doc = Document(
            page_content=text,
            metadata={"type": "description", "source": "direct_input"}
        )
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        split_docs = splitter.split_documents([doc])
        
        self.vector_store.add_documents(split_docs, Config.DESCRIPTION_INDEX_NAME)
        
    def process_product_text(self, text: str) -> List[Dict]:
        """Process and store product text"""
        doc = Document(
            page_content=text,
            metadata={"type": "product", "source": "direct_input"}
        )
        
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.PRODUCT_CHUNK_SIZE,
            chunk_overlap=Config.PRODUCT_CHUNK_OVERLAP
        )
        split_docs = splitter.split_documents([doc])
        
        products = []
        for doc in split_docs[:3]:  # Limit to first 3 chunks
            product_info = self.llm_service.format_product_info(doc.page_content)
            products.extend([dict(prod) for prod in product_info.products])
            
        # Store products in vector store
        product_docs = [
            Document(
                page_content=str(prod),
                metadata={"type": "product", "doc_id": str(time.time())}
            )
            for prod in products
        ]
        self.vector_store.add_documents(product_docs, Config.PRODUCT_INDEX_NAME)
        
        return products
        
    def get_chatbot_response(self, query: str) -> str:
        """Get chatbot response based on query"""
        ratio = self.llm_service.get_retriever_ratio(query)
        
        num_desc_docs = int((1 - ratio) * 10)
        num_prod_docs = 10 - num_desc_docs
        
        desc_docs = self.vector_store.search_documents(
            query,
            Config.DESCRIPTION_INDEX_NAME,
            k=num_desc_docs
        )
        prod_docs = self.vector_store.search_documents(
            query,
            Config.PRODUCT_INDEX_NAME,
            k=num_prod_docs
        )
        
        documents = desc_docs + prod_docs
        return self.llm_service.get_chatbot_response(query, documents)
        
    def get_all_products(self) -> List[Dict]:
        """Get all products from the vector store"""
        docs = self.vector_store.get_all_documents(Config.PRODUCT_INDEX_NAME)
        products = []
        
        for doc in docs:
            if doc.metadata.get("type") == "init":
                continue
                
            try:
                import ast
                product_dict = ast.literal_eval(doc.page_content)
                if product_dict and any(product_dict.values()):
                    products.append(product_dict)
            except Exception:
                products.append({"raw_content": doc.page_content})
                
        return products

    def add_product(self, product_data: Dict) -> Dict:
        """Add a single product to the vector store
        
        Args:
            product_data: Dictionary containing product information
            
        Returns:
            Dictionary containing the added product and its ID
        """
        # Create ProductService object for validation
        product = ProductService(**product_data)
        
        # Create document with metadata
        doc_id = str(time.time())
        doc = Document(
            page_content=str(dict(product)),
            metadata={
                "type": "product",
                "doc_id": doc_id,
                "name": product.name
            }
        )
        
        # Add to vector store
        self.vector_store.add_documents([doc], Config.PRODUCT_INDEX_NAME)
        
        return {
            "product": dict(product),
            "product_id": doc_id
        }
        
    def remove_product(self, product_id: str = None, product_name: str = None) -> bool:
        """Remove a product from the vector store
        
        Args:
            product_id: ID of the product to remove
            product_name: Name of the product to remove (used if ID not provided)
            
        Returns:
            Boolean indicating if product was removed successfully
        """
        if not product_id and not product_name:
            raise ValueError("Either product_id or product_name must be provided")
            
        # Create list of IDs to remove
        ids_to_remove = []
        
        # Get all documents
        docs = self.vector_store.get_all_documents(Config.PRODUCT_INDEX_NAME)
        
        for doc in docs:
            if doc.metadata.get("type") == "init":
                continue
                
            # Match by ID
            if product_id and doc.metadata.get("doc_id") == product_id:
                ids_to_remove.append(doc.metadata.get("doc_id"))
                break
                
            # Match by name
            if product_name and not product_id:
                try:
                    import ast
                    product_dict = ast.literal_eval(doc.page_content)
                    if product_dict.get("name") == product_name:
                        ids_to_remove.append(doc.metadata.get("doc_id"))
                except Exception:
                    continue
                    
        if ids_to_remove:
            self.vector_store.remove_documents(ids_to_remove, Config.PRODUCT_INDEX_NAME)
            return True
            
        return False
        
    def add_description(self, text: str, title: str = "Untitled", source: str = "direct_input") -> Dict:
        """Add a description document to the vector store
        
        Args:
            text: The description text
            title: Title of the description
            source: Source of the description
            
        Returns:
            Dictionary containing the document ID and metadata
        """
        if not text or len(text.strip()) < 50:
            raise ValueError("Description text must be at least 50 characters")
            
        # Create document with metadata
        doc_id = str(time.time())
        doc = Document(
            page_content=text,
            metadata={
                "type": "description",
                "doc_id": doc_id,
                "title": title,
                "source": source,
                "created_at": time.time()
            }
        )
        
        # Add to vector store
        self.vector_store.add_documents([doc], Config.DESCRIPTION_INDEX_NAME)
        
        return {
            "doc_id": doc_id,
            "title": title,
            "source": source
        }
        
    def remove_description(self, doc_id: str) -> bool:
        """Remove a description document from the vector store
        
        Args:
            doc_id: ID of the document to remove
            
        Returns:
            Boolean indicating if document was removed successfully
        """
        # Get all documents
        docs = self.vector_store.get_all_documents(Config.DESCRIPTION_INDEX_NAME)
        
        # Find document to remove
        for doc in docs:
            if doc.metadata.get("doc_id") == doc_id:
                self.vector_store.remove_documents([doc_id], Config.DESCRIPTION_INDEX_NAME)
                return True
                
        return False
        
    def get_all_descriptions(self) -> List[Dict]:
        """Get all descriptions from the vector store"""
        docs = self.vector_store.get_all_documents(Config.DESCRIPTION_INDEX_NAME)
        descriptions = []
        
        for doc in docs:
            if doc.metadata.get("type") == "init":
                continue
                
            descriptions.append({
                "content": doc.page_content,
                "metadata": doc.metadata,
                "doc_id": doc.metadata.get("doc_id", "unknown")
            })
                
        return descriptions
        
    def get_description_by_id(self, doc_id: str) -> Optional[Dict]:
        """Get a single description by its ID"""
        docs = self.vector_store.get_all_documents(Config.DESCRIPTION_INDEX_NAME)
        
        for doc in docs:
            if doc.metadata.get("doc_id") == doc_id:
                return {
                    "content": doc.page_content,
                    "metadata": doc.metadata,
                    "doc_id": doc_id
                }
        return None
        
    def update_description(self, doc_id: str, text: str, title: str = None) -> bool:
        """Update an existing description document
        
        Args:
            doc_id: ID of the document to update
            text: New description text
            title: New title (optional)
            
        Returns:
            Boolean indicating if update was successful
        """
        docs = self.vector_store.get_all_documents(Config.DESCRIPTION_INDEX_NAME)
        old_doc = None
        new_docs = []
        
        for doc in docs:
            if doc.metadata.get("doc_id") == doc_id:
                old_doc = doc
                # Create updated document
                new_doc = Document(
                    page_content=text,
                    metadata={
                        **old_doc.metadata,
                        "title": title if title else old_doc.metadata.get("title", "Untitled"),
                        "updated_at": time.time()
                    }
                )
                new_docs.append(new_doc)
            else:
                new_docs.append(doc)
                
        if not old_doc:
            return False
            
        # Update vector store with new documents
        self.vector_store.update_documents(new_docs, Config.DESCRIPTION_INDEX_NAME)
        return True 