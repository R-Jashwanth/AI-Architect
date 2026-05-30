# AI Architect (Archi)

**AI Architect** is a cutting-edge platform designed to revolutionize the interior design and construction industry. It combines the power of generative AI, Augmented Reality (AR), and comprehensive project management tools to streamline the workflow for architects, interior designers, contractors, and homeowners.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Key Features

*   **🎨 AI Design Generator**: Generate stunning interior design concepts using advanced AI models. Visualize spaces in different styles instantly.
*   **📱 AR Furniture Placement**: Visualize furniture in your real-world space using Augmented Reality. Supports WebXR for compatible devices and interactive 3D model viewing for all users.
    *   **Cross-Platform**: Works on Desktop, iOS (AR Quick Look), and Android (Scene Viewer).
*   **📋 Project Management**: Complete suite for managing construction and design projects.
    *   **Cost Estimator**: Real-time project cost estimation and budget tracking.
    *   **Task Management**: Kanban-style task boards and progress tracking.
*   **🤝 Collaborative Network**:
    *   **Contractor Marketplace**: Connect with verified professionals (contractors, architects, designers).
    *   **Bidding System**: Post projects and receive competitive bids from professionals.
    *   **Real-time Collaboration**: Chat and share updates with team members.

## 🛠️ Technology Stack

### Frontend
*   **Framework**: [Next.js 14+](https://nextjs.org/) (React)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/) components.
*   **AR/3D**: [@google/model-viewer](https://modelviewer.dev/), Three.js.
*   **State Management**: React Context, Hooks.

### Backend
*   **API**: Python [FastAPI](https://fastapi.tiangolo.com/).
*   **AI Models**: Integrated with various AI services for image generation and processing.
*   **Database**: [Supabase](https://supabase.com/) (PostgreSQL) for persistence and real-time features.
*   **Authentication**: Supabase Auth.

## 🏁 Getting Started

### Prerequisites
*   Node.js (v20.x or higher)
*   Python (3.8 or higher)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/R-Jashwanth/AI-Architect.git
    cd AI-Architect
    ```

2.  **Install Frontend Dependencies**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies**
    Navigate to the `Backend` directory and install Python requirements.
    ```bash
    cd Backend
    pip install -r requirements.txt
    ```

4.  **Environment Setup**
    Create a `.env` file in the root directory based on `.env.example`.
    ```bash
    cp .env.example .env
    ```
    Populate the following required variables:
    *   `NEXT_PUBLIC_SUPABASE_URL`
    *   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    *   [Add other required keys here]

### 🏃‍♂️ Running the Application

1.  **Start the Backend Server**
    Open a terminal and run:
    ```bash
    cd Backend
    python -m uvicorn routes:app --host 0.0.0.0 --port 8000 --reload
    ```
    The backend API will be available at `http://localhost:8000`.

2.  **Start the Frontend Development Server**
    Open a new terminal and run:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000`.

## 📱 Augmented Reality (AR) Setup
To test AR features:
1.  Ensure you have a compatible device (iPhone with iOS 12+ or Android with ARCore).
2.  Access the application via a secure context (HTTPS) or localhost.
3.  For local mobile testing, use `npm run dev:mobile` and access via your computer's IP address.

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
