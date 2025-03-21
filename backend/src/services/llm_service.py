from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.documents.base import Document
from typing import List, Dict, Any
from src.config.config import Config
from src.models.data_models import UrlClassify, ListProduct, SelectRetrieverRatio

class LLMService:
    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(model=Config.MODEL)
        self.web_classifier = self.llm.with_structured_output(UrlClassify)
        self.retriever_selector = self.llm.with_structured_output(SelectRetrieverRatio)
        self.prod_format_llm = self.llm.with_structured_output(ListProduct)
        
    def classify_urls(self, urls: List[str]) -> UrlClassify:
        """Classify URLs into description and product service URLs"""
        return self.web_classifier.invoke(str(urls))
        
    def get_retriever_ratio(self, query: str) -> float:
        """Get the ratio for retriever selection"""
        return self.retriever_selector.invoke(query).ratio
        
    def format_product_info(self, content: str) -> ListProduct:
        """Format raw content into product information"""
        return self.prod_format_llm.invoke(content)
        
    def get_chatbot_response(self, query: str, documents: List[Document]) -> str:
        """Get chatbot response based on query and relevant documents"""
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", "Act as Customer Support Manager"),
            ("user", "Your task is to respond to the following customer query: {query}\n"
                    "Provide the most relevant information based on the query and keep the message on point short and well formated.\n"
                    "You have access to the following documents: {documents}")
        ])
        
        chain = prompt_template | self.llm
        response = chain.invoke({"query": query, "documents": documents})
        return response.content 