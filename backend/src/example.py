from services.main_service import MainService

def main():
    # Initialize the main service
    service = MainService()
    
    # Example: Extract and classify URLs from a website
    url = "https://example.com"
    try:
        classified_urls = service.extract_and_classify_urls(url)
        print("Classified URLs:", classified_urls)
        
        # Process description URLs
        if classified_urls['desc_urls']:
            service.process_description_urls(classified_urls['desc_urls'])
            print("Processed description URLs")
            
        # Process product URLs
        if classified_urls['product_service_urls']:
            products = service.process_product_urls(classified_urls['product_service_urls'])
            print("Processed products:", products)
            
        # Example: Add a product directly
        product_text = """
        Product Name: Example Product
        Description: This is an example product description
        Price: 99.99
        Specifications: High quality materials
        Features: Easy to use, durable
        """
        products = service.process_product_text(product_text)
        print("Added product:", products)
        
        # Example: Get chatbot response
        query = "Tell me about your products"
        response = service.get_chatbot_response(query)
        print("Chatbot response:", response)
        
        # Example: Get all products
        all_products = service.get_all_products()
        print("All products:", all_products)
        
    except Exception as e:
        print(f"Error: {str(e)}")

if __name__ == "__main__":
    main() 