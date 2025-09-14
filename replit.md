# FloatChat Backend

## Overview

FloatChat is an AI-powered conversational interface for ARGO ocean data. The system consists of a Node.js/Express backend API that integrates with a Python-based RAG (Retrieval-Augmented Generation) service to provide intelligent responses about oceanographic data. The application allows users to interact with ARGO float data through natural language queries, perform chain simulations, and visualize ocean data with AI-generated insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
The system follows a modular Express.js architecture with clear separation of concerns:

**API Layer**: RESTful API endpoints organized by feature domains (auth, chat, users, images, queries)
**Service Layer**: Business logic encapsulated in service classes for reusability and testability
**Data Layer**: MongoDB integration using Mongoose ODM for data persistence
**Middleware Stack**: Security (Helmet), CORS, rate limiting, JWT authentication, request validation, and comprehensive error handling

**Authentication**: JWT-based stateless authentication with role-based access control
**Security**: Multi-layered security with Helmet for HTTP headers, rate limiting per endpoint type, input validation using express-validator, and secure password hashing with bcryptjs

### Frontend Integration
**CORS Configuration**: Configurable origin support for development and production environments
**Image Integration**: Unsplash API integration for profile pictures and ocean-related imagery
**Real-time Features**: Session-based chat history with MongoDB persistence

### Data Architecture
**Primary Database**: MongoDB for user data, chat sessions, and application state
**ARGO Data Model**: Structured schema for oceanographic float data with optimized indexes
**Chat Sessions**: Conversation history with support for sources and data points from RAG responses

### RAG-LLM Integration
**Python Service Communication**: HTTP-based communication with Python Flask service for AI operations
**Endpoints**: Chat responses, chain simulations, and natural language to MongoDB query translation
**Data Flow**: Questions sent to Python service, responses enriched with ARGO data and research paper sources
**Error Handling**: Comprehensive error handling with fallback mechanisms and service health monitoring

### Logging and Monitoring
**Winston Logging**: Structured JSON logging with file rotation and environment-specific console output
**Health Checks**: Multi-service health monitoring including MongoDB, Node.js, and Python RAG service status
**Performance Monitoring**: Request logging with Morgan and response time tracking

## External Dependencies

### Third-Party Services
**Unsplash API**: Image search and retrieval for user profiles and ocean-related content
**Google Gemini AI**: LLM integration through the Python RAG service for generating intelligent responses
**ARGO Data Sources**: Integration with ArgoPy for fetching real oceanographic float data

### Databases
**MongoDB**: Primary database for user accounts, authentication, chat sessions, conversation history, and ARGO profile data storage
**FAISS Vector Store**: Vector database integration through Python service for semantic search of research papers and ARGO data

### Key Libraries
**Express.js**: Web framework with comprehensive middleware ecosystem
**Mongoose**: MongoDB ODM for data modeling and queries  
**JWT**: Stateless authentication token management
**Axios**: HTTP client for external API communication
**Helmet**: Security middleware for HTTP headers
**Winston**: Advanced logging with structured output
**Express-validator**: Input validation and sanitization
**Express-rate-limit**: API rate limiting protection

### Python RAG Service Dependencies
**Flask**: Python web framework for RAG endpoints
**LangChain**: RAG pipeline implementation with document processing
**FAISS**: Vector similarity search for document retrieval
**HuggingFace Embeddings**: Text embedding generation for semantic search
**ArgoPy**: ARGO oceanographic data fetching and processing
**Google Generative AI**: Integration with Gemini models for response generation