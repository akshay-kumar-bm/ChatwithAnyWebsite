# Chat with Any Website

## Overview

Welcome to the Chat with Any Website project! This application is designed to help businesses automate staff tasks, save money, and improve efficiency by leveraging AI-powered features. The app allows you to extract and classify URLs, process description and product URLs, and manage products and descriptions. By using this app, businesses can streamline their operations and enhance productivity.

## Features

### URL Extraction and Classification

- **Extract Navigation URLs**: Automatically extract navigation URLs from any website.
- **Classify URLs**: Classify URLs into description URLs and product/service URLs.

### Description Management

- **Process Description URLs**: Process and store description URLs in a vector store for easy retrieval.
- **Add Description Text**: Add description text directly and store it in the vector store.
- **View All Descriptions**: Retrieve and view all stored descriptions.
- **Remove Descriptions**: Remove descriptions by their document ID.

### Product Management

- **Process Product URLs**: Process and store product URLs in a vector store for easy retrieval.
- **Add Product Text**: Add product information directly and store it in the vector store.
- **View All Products**: Retrieve and view all stored products.
- **Remove Products**: Remove products by their ID or name.

### Chatbot

- **Interactive Chat Interface**: Engage with a chatbot that provides context-aware responses based on processed website content.
- **Retrieve Relevant Information**: Get the most relevant information based on user queries.

## Benefits

By using the Chat with Any Website app, businesses can:

- **Save Time**: Automate repetitive tasks and reduce manual effort.
- **Save Money**: Minimize the need for additional staff by automating tasks.
- **Improve Efficiency**: Streamline operations and enhance productivity.
- **Enhance Customer Support**: Provide quick and accurate responses to customer queries through the chatbot.

## Examples and Use Cases

### Example 1: Automating Product Management

A business can use the app to automate the process of managing product information. By extracting product URLs from their website, the app can classify and store product details in a vector store. This allows the business to easily retrieve and update product information, saving time and effort.

### Example 2: Enhancing Customer Support

The chatbot feature can be used to enhance customer support by providing quick and accurate responses to customer queries. By processing description and product URLs, the app can retrieve relevant information and assist customers effectively.

### Example 3: Streamlining Content Management

Businesses can use the app to manage and organize their website content. By processing description URLs, the app can store and retrieve content efficiently, making it easier to update and maintain the website.

## Getting Started

### Prerequisites

- Python 3.8 or higher
- Flask
- Selenium
- Flask-CORS
- Langchain Community
- Langchain Google GenAI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akshaykumarbedre/ChatwithAnyWebsite.git
   cd ChatwithAnyWebsite/backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   Create a `.env` file in the `backend` directory with the following variables:
   ```
   GOOGLE_API_KEY=your_google_api_key
   MODEL=your_model_name
   ```

### Running the App

1. Start the Flask backend server:
   ```bash
   python app.py
   ```

2. Access the app at `http://localhost:5000`.

## Contributing

We welcome contributions to the Chat with Any Website project! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
