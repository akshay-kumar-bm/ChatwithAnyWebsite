import os
from typing import List, Optional
from langchain_community.vectorstores import FAISS
from langchain_core.documents.base import Document
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from src.config.config import Config

class VectorStoreService:
    def __init__(self):
        self.embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        os.makedirs(Config.VECTOR_STORE_PATH, exist_ok=True)
        
    def _initialize_store(self, store_path: str) -> FAISS:
        """Initialize a new vector store if it doesn't exist"""
        empty_doc = Document(
            page_content="Initialization document",
            metadata={"type": "init"}
        )
        vector_store = FAISS.from_documents(
            documents=[empty_doc],
            embedding=self.embeddings
        )
        vector_store.save_local(store_path)
        return vector_store
        
    def get_vector_store(self, store_name: str) -> FAISS:
        """Get or create a vector store"""
        store_path = os.path.join(Config.VECTOR_STORE_PATH, store_name)
        try:
            return FAISS.load_local(store_path, self.embeddings, allow_dangerous_deserialization=True)
        except Exception:
            return self._initialize_store(store_path)
            
    def add_documents(self, documents: List[Document], store_name: str) -> None:
        """Add documents to a vector store"""
        vector_store = self.get_vector_store(store_name)
        vector_store.add_documents(documents)
        store_path = os.path.join(Config.VECTOR_STORE_PATH, store_name)
        vector_store.save_local(store_path)
        
    def search_documents(self, query: str, store_name: str, k: int = 10) -> List[Document]:
        """Search for relevant documents in a vector store"""
        vector_store = self.get_vector_store(store_name)
        return vector_store.similarity_search(query, k=k)
        
    def remove_documents(self, doc_ids: List[str], store_name: str) -> None:
        """Remove documents from a vector store"""
        vector_store = self.get_vector_store(store_name)
        docstore = vector_store.docstore
        
        new_docs = [
            doc for doc_id, doc in docstore._dict.items()
            if doc.metadata.get("doc_id") not in doc_ids
        ]
        
        if new_docs:
            new_vector_store = FAISS.from_documents(
                documents=new_docs,
                embedding=self.embeddings
            )
            store_path = os.path.join(Config.VECTOR_STORE_PATH, store_name)
            new_vector_store.save_local(store_path)
            
    def get_all_documents(self, store_name: str) -> List[Document]:
        """Get all documents from a vector store"""
        vector_store = self.get_vector_store(store_name)
        return vector_store.similarity_search(
            "all documents",
            k=Config.MAX_SEARCH_RESULTS
        ) 