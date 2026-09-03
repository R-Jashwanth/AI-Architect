# ArchiAI — AI-Powered Interior Design Platform

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

**ArchiAI** is a full-stack AI-powered interior design platform that helps users transform natural-language ideas into **interior design concepts, floor-plan concepts, and Vastu-oriented recommendations**.

The platform combines **Generative AI, Augmented Reality, intelligent search, project management, collaboration, and analytics** into a single application for homeowners, architects, interior designers, and contractors.

---

## Overview

Designing an interior typically involves multiple disconnected tools for visualization, planning, furniture selection, project management, and collaboration.

ArchiAI brings these workflows together.

A user can describe their requirements in natural language, such as:

> "Create a room with yellow walls, a study table with a lamp, and a horse painting on the wall."

The platform processes the request, enhances the prompt with relevant design context, sends it through the AI generation layer, and displays the resulting design.

The platform also provides tools for floor-plan concepts, Vastu assistance, AR furniture visualization, design search, project management, and analytics.

---

## Key Features

### AI Interior Design Generation

Generate personalized interior concepts from natural-language prompts.

- AI-powered interior visualization.
- Automatic room-type detection.
- Automatic design-style detection.
- Prompt enhancement for better AI generation.
- Furniture and object detection.
- Object placement detection.
- Support for user-specified colors, artwork, furniture, and room requirements.
- Photorealistic interior visualization.


### Intelligent Prompt Enhancement

ArchiAI processes the user's natural-language prompt before sending it to an image-generation model.

The system can detect:

- Room type
- Interior style
- Furniture
- Objects
- Object attributes
- Object placement
- Room dimensions
- Regional/cultural context
- Specific design requirements

Example:

```text
User Prompt
     ↓
Room Detection
     ↓
Style Detection
     ↓
Object Detection
     ↓
Placement Detection
     ↓
Dimension Detection
     ↓
Prompt Enhancement
     ↓
AI Image Generation
```

This allows the AI model to receive more structured design context while preserving the user's original intent.

---

### AI Floor-Plan Concepts

ArchiAI includes an AI-assisted floor-plan generation workflow.

It can process requirements such as:

- Room types
- Room dimensions
- Furniture requirements
- Doors and windows
- Spatial relationships
- Layout requirements

The resulting output is intended as a **design concept**, not a construction-ready architectural drawing.

---

### Vastu AI Assistant

ArchiAI provides AI-assisted Vastu interactions for users interested in incorporating Vastu considerations into their design workflow.

The Vastu assistant can provide conversational guidance around:

- Room placement
- Orientation
- Spatial requirements
- Interior planning considerations
- User-specific Vastu questions

---

### AR Furniture Visualization

The platform provides interactive 3D and AR furniture visualization.

Supported capabilities include:

- WebXR for compatible devices.
- Interactive 3D model viewing.
- iOS AR Quick Look.
- Android Scene Viewer / ARCore.
- Desktop 3D visualization.

This allows users to explore furniture and design elements before making physical changes to their space.

---

### Real-Time Analytics Dashboard

The platform includes an analytics dashboard for monitoring application activity.

The analytics layer can track areas such as:

- AI generation activity
- Generation success and failure
- User activity
- Feature usage
- Project activity
- Search activity

The dashboard provides visibility into application usage and AI-service performance.

---

### Project Management

ArchiAI includes project-management capabilities for interior design and construction workflows.

#### Cost Estimation

- Project budget tracking.
- Cost estimation.
- Expense management.

#### Task Management

- Kanban-style task management.
- Task progress tracking.
- Project workflow organization.

---

### Contractor Marketplace

The platform is designed to connect users with professionals involved in design and construction.

Supported workflows include:

- Contractor discovery.
- Architect and designer discovery.
- Project posting.
- Professional bidding.
- Project collaboration.

---

### Real-Time Collaboration

Project participants can collaborate through:

- Real-time chat.
- Project updates.
- Shared project information.
- Client and professional communication.

---
### Five-Model Image Generation Fallback

ArchiAI uses a **five-model image-generation chain** to reduce dependence on a single model.

The configured model sequence is:

```text
1. FLUX.1-dev
       ↓
2. FLUX.1-schnell
       ↓
3. Stable Diffusion 2.1
       ↓
4. Stable Diffusion 2
       ↓
5. Stable Diffusion v1.4
```

The system attempts the configured models sequentially when an image-generation attempt fails.

> Model availability depends on the configured inference provider and current provider support. The fallback architecture is designed to improve resilience rather than guarantee that every model is always available.

---
### Hybrid Design Search

ArchiAI combines AI-generated designs with real-world design references.

The search layer integrates **8+ configured sources**, including:

- Pexels
- Unsplash
- Pixabay
- Openverse
- Wikimedia
- Rawpixel
- Picsum
- Enhanced web-scraping sources such as Houzz and Architectural Digest

The system can aggregate and process results from multiple providers rather than depending on a single image source.

---

# Multi-AI Architecture

ArchiAI uses a modular multi-AI architecture.

Different AI capabilities are separated into dedicated services.

```text
                         ArchiAI
                            │
             ┌──────────────┼──────────────┐
             │              │              │
             ▼              ▼              ▼
          Groq         Hugging Face    Custom AI
             │              │              │
             ▼              ▼              ▼
        Chat / Vastu    Image Gen.     Domain Logic
        Reasoning       Interior AI    Floor Plans
```

### AI Provider Roles

| Provider / Service | Purpose |
|---|---|
| Groq | Conversational AI, reasoning, recommendations |
| Hugging Face | Image-generation workflows |
| Custom Python Services | Application-specific AI functionality |
| Multi-AI Service | Provider/model orchestration and fallback |

The architecture makes it possible to replace or update individual AI services without redesigning the entire application.

---

# System Architecture

```text
                         ┌─────────────────────────┐
                         │      React Frontend      │
                         │    TypeScript / UI       │
                         └────────────┬────────────┘
                                      │
                                      ▼
                         ┌─────────────────────────┐
                         │       FastAPI API        │
                         │    Backend Application   │
                         └────────────┬────────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
             ▼                        ▼                        ▼
     ┌───────────────┐       ┌────────────────┐       ┌────────────────┐
     │   AI Layer    │       │  Search Layer  │       │ Project Layer  │
     │               │       │                │       │                │
     │ Interior AI   │       │ 8+ Sources     │       │ Tasks          │
     │ Floor Plans   │       │ Hybrid Search  │       │ Cost Estimator │
     │ Vastu AI      │       │                │       │ Collaboration  │
     │ Chat          │       │                │       │ Marketplace    │
     └───────┬───────┘       └────────────────┘       └────────────────┘
             │
             ▼
     ┌─────────────────────────────────────────┐
     │              Multi-AI Layer             │
     │                                         │
     │   Groq │ Hugging Face │ Custom Models   │
     └─────────────────────┬───────────────────┘
                           │
                           ▼
                 ┌─────────────────────┐
                 │       Supabase       │
                 │ Authentication       │
                 │ PostgreSQL           │
                 │ Real-time Services   │
                 └─────────────────────┘
```

---

# Technology Stack

## Frontend

- **React**
- **TypeScript**
- **Next.js 14+**
- **Tailwind CSS**
- **shadcn/ui**
- React Context
- React Hooks

## Backend

- **Python**
- **FastAPI**
- REST APIs
- Modular service architecture

## AI / Machine Learning

- **Groq**
- **Hugging Face Inference Providers**
- **FLUX**
- **Stable Diffusion**
- Custom Python AI services
- Prompt engineering and enhancement pipelines

## Database & Backend Services

- **Supabase**
- **PostgreSQL**
- Supabase Authentication
- Real-time capabilities

## AR / 3D

- **Three.js**
- **@google/model-viewer**
- **WebXR**
- iOS AR Quick Look
- Android Scene Viewer / ARCore

## Search

- Pexels
- Unsplash
- Pixabay
- Openverse
- Wikimedia
- Rawpixel
- Picsum
- Web-scraping based sources

## Development

- Git
- GitHub
- VS Code
- npm
- Python

---

# Project Structure

```text
AI-Architect/
│
├── Backend/
│   ├── routes/
│   ├── services/
│   │   ├── multi_ai_service.py
│   │   ├── interior_ai_service.py
│   │   ├── floor_plan_service.py
│   │   ├── ar_furniture_service.py
│   │   └── ...
│   │
│   ├── models/
│   ├── database/
│   ├── requirements.txt
│   └── ...
│
├── app/
├── components/
├── public/
│
├── package.json
├── .env.example
├── LICENSE
└── README.md
```

---

# Getting Started

## Prerequisites

Install the following:

- Node.js 20+
- Python 3.8+
- npm or yarn
- Git
- A Supabase project
- Required AI provider API keys

---

## 1. Clone the Repository

```bash
git clone https://github.com/R-Jashwanth/AI-Architect.git
cd AI-Architect
```

---

## 2. Install Frontend Dependencies

```bash
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

---

## 4. Configure Environment Variables

Create your environment configuration using `.env.example`.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GROQ_API_KEY=your_groq_api_key
HUGGING_FACE_API_TOKEN=your_huggingface_token

OPENAI_API_KEY=your_openai_api_key
REPLICATE_API_TOKEN=your_replicate_token
```

Only configure providers that are enabled in your deployment.

**Never commit API keys or `.env` files to GitHub.**

---

# Running the Application

## Start the Backend

From the `Backend` directory:

```bash
python -m uvicorn routes:app --host 0.0.0.0 --port 8000 --reload
 ```

Backend API:

```text
http://localhost:8000
```

---

## Start the Frontend

Open another terminal:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# Example User Workflow

```text
                User
                  │
                  ▼
        Natural Language Prompt
                  │
                  ▼
       Requirement Understanding
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
      Room      Style     Objects
    Detection  Detection  & Placement
        │         │         │
        └─────────┼─────────┘
                  ▼
          Prompt Enhancement
                  │
                  ▼
             AI Service
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
     Interior   Floor      Vastu
      Design     Plan       AI
        │         │         │
        └─────────┼─────────┘
                  ▼
             User Result
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
       AR       Search    Analytics
    Furniture  Results    Dashboard
```

---

# Example Prompt

```text
Create a modern bedroom with yellow accent walls,
a wooden study table, a desk lamp, warm wooden flooring,
and a horse painting above the study area.
```

ArchiAI can process the prompt to identify the relevant:

- Room type
- Style
- Color
- Furniture
- Artwork
- Placement requirements

and then enhance the prompt before sending it to the image-generation service.

---

# Reliability & Fallback Architecture

The image-generation system uses a model fallback chain:

```text
FLUX.1-dev
     │
     ├── Failure
     ▼
FLUX.1-schnell
     │
     ├── Failure
     ▼
Stable Diffusion 2.1
     │
     ├── Failure
     ▼
Stable Diffusion 2
     │
     ├── Failure
     ▼
Stable Diffusion v1.4
```

This approach helps reduce the impact of individual model failures, provider availability changes, and transient errors.

The project has a **reported 95% generation success rate in internal testing**.

> The 95% figure is a project-level testing metric, not a guaranteed production availability percentage. For reproducibility, the testing methodology and dataset should be documented separately.

---

# Engineering Highlights

### Modular AI Services

AI capabilities are separated into individual services so that interior generation, floor plans, Vastu assistance, chat, and other functionality can be developed independently.

### Provider Abstraction

The application separates AI application logic from provider-specific integrations, making it easier to replace models or providers.

### Prompt Engineering

User requirements are enriched with room, style, object, placement, and design context before image generation.

### Multi-Source Search

The search system combines results from multiple sources and provides alternative sources when individual providers are unavailable.

### Real-Time Data

Supabase provides persistence, authentication, and real-time application capabilities.

### Cross-Platform AR

The 3D/AR layer supports browser-based visualization as well as platform-specific AR experiences.

---

# AR Setup

To test AR functionality:

1. Use an AR-compatible device.
2. Access the application through HTTPS or localhost where supported.
3. Android users should have an ARCore-compatible device.
4. iOS users should have a compatible device for AR Quick Look.
5. For local mobile testing, expose the development server to your local network.

Example:

```bash
npm run dev:mobile
```

---

# Important Notes

### AI-Generated Floor Plans

AI-generated floor plans are conceptual visualizations. They should not be treated as construction-ready architectural drawings without professional verification.

### AI-Generated Interior Designs

Generated images are design concepts and may not accurately represent real-world dimensions, materials, structural constraints, or product availability.

### Third-Party Providers

AI model availability and API behavior can change over time. The platform therefore uses a modular provider architecture to make model/provider changes easier to manage.

---

# Future Enhancements

- Structured CAD-compatible floor-plan generation
- More accurate spatial and dimensional reasoning
- 3D architectural visualization
- AI-powered material recommendations
- Automated material cost estimation
- Advanced Vastu spatial analysis
- Personalized design recommendations
- Improved AR furniture interaction
- AI-powered contractor matching
- Advanced project analytics
- Automated project estimation
- Client-contractor workflow automation

---

# Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement your changes.
4. Test the application locally.
5. Commit your changes.
6. Open a Pull Request.

---

# License

This project is licensed under the **MIT License**.

See the [`LICENSE`](LICENSE) file for details.

---

# Author

**Jashwanth R**

Artificial Intelligence & Data Science | Machine Learning | Full-Stack Development

GitHub: [R-Jashwanth](https://github.com/R-Jashwanth)

---

## Project Summary

**ArchiAI brings together:**

```text
Generative AI
      +
Interior Design
      +
Floor-Plan Concepts
      +
Vastu Assistance
      +
AR / 3D Visualization
      +
Hybrid Search
      +
Project Management
      +
Real-Time Analytics
      =
AI-Powered Interior Design Platform
```

The project demonstrates the practical integration of **Generative AI, multi-provider AI architecture, full-stack development, REST APIs, database systems, hybrid search, real-time analytics, and AR/3D technologies** into a single domain-specific application.