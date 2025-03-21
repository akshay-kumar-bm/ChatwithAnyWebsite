# Chat with Any Website - Streamlit Frontend

This is the Streamlit frontend application for the Chat with Any Website project. It provides a user-friendly interface to interact with all the functionalities of the backend service.

## Features

1. **URL Processing**
   - Extract and classify URLs from any website
   - View description and product/service URLs separately

2. **Product Management**
   - Add new products with details
   - View all products in the database
   - Remove products by ID or name
   - Process product URLs in bulk

3. **Description Management**
   - Add new descriptions
   - View all descriptions
   - Remove descriptions by ID
   - Process description URLs in bulk

4. **Chatbot**
   - Interactive chat interface
   - Context-aware responses based on processed website content
   - Persistent chat history within the session

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements_streamlit.txt
```

2. Make sure you have a `.env` file with the following variables:
```
GOOGLE_API_KEY=your_google_api_key
MODEL=your_model_name
```

3. Ensure the Flask backend server is running on `http://localhost:5000`

## Running the App

To run the Streamlit app:

```bash
streamlit run streamlit_app.py
```

The app will be available at `http://localhost:8501` by default.

## Usage

1. **URL Processing**
   - Enter a website URL in the input field
   - Click "Extract URLs" to get classified URLs

2. **Product Management**
   - Use the tabs to switch between different product management functions
   - Add products by filling out the form
   - View products by clicking the "Refresh Products" button
   - Remove products using either ID or name
   - Process multiple product URLs by entering them one per line

3. **Description Management**
   - Add descriptions using the form (minimum 50 characters)
   - View all descriptions using the "Refresh Descriptions" button
   - Remove descriptions using their document ID
   - Process multiple description URLs by entering them one per line

4. **Chatbot**
   - Type your question in the chat input
   - View chat history and responses in a conversational format

## Notes

- The app requires an active connection to the Flask backend server
- All data is stored and managed by the backend service
- The chat history is maintained only for the current session 