from pydantic import BaseModel, Field, AnyUrl
from typing import List, Optional

class UrlClassify(BaseModel):
    desc_urls: List[AnyUrl]
    product_service_urls: List[AnyUrl]

class ProductService(BaseModel):
    name: str = Field(None, title="Product Name")
    description: str = Field(None, title="Product Description")
    price: float = Field(None, title="Product Price")
    specifications: str = Field(None, title="Product Specifications")
    features: str = Field(None, title="Product Features")

class ListProduct(BaseModel):
    products: List[ProductService]

class SelectRetrieverRatio(BaseModel):
    ratio: float 