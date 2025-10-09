# Gitfolio Blogger

This is a personal portfolio and blog website built with Next.js, TypeScript, and Tailwind CSS. It's designed to be easily customizable and deployable, with content managed through simple Markdown files.

## Features

-   **Modern Tech Stack**: Built with Next.js 15 (App Router), React, and TypeScript.
-   **Styling**: Styled with Tailwind CSS and pre-built components from ShadCN/UI.
-   **Content-driven**: Portfolio sections (About, Experience, etc.) and blog posts are managed via Markdown files.
-   **Responsive Design**: Fully responsive layout that works on all screen sizes.
-   **Dark Mode**: Comes with a pre-configured dark theme.
-   **Genkit Integration**: Includes setup for Google's Genkit for AI-powered features.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or another package manager like [Yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Open your terminal in the project root and run the following command:
    ```bash
    npm install
    ```

### Running the Development Server

Once the dependencies are installed, you can start the local development server:

```bash
npm run dev
```

This will start the application in development mode with Turbopack. Open [http://localhost:9002](http://localhost:9002) to view it in your browser. The page will auto-update as you edit the files.

## Project Structure

-   `src/app/`: Contains the main pages and layouts for the Next.js App Router.
-   `src/components/`: Shared React components used across the application.
-   `src/lib/`: Utility functions, data fetching logic, and configurations.
-   `src/ai/`: Contains Genkit flows for AI functionality.
-   `content/`: Markdown files for the portfolio pages (About Me, Experience, etc.).
-   `posts/`: Markdown files for your blog posts.
-   `public/`: Static assets like images.
-   `tailwind.config.ts`: Configuration file for Tailwind CSS.
-   `next.config.ts`: Configuration file for Next.js.

## Content Management

Updating the content of your portfolio and blog is simple.

-   **Portfolio Pages**: To edit the content on the "About Me", "Experience", "Projects", "Certifications", or "Current Status" pages, modify the corresponding Markdown (`.md`) files inside the `content/` directory. The frontmatter (the block at the top of the file) contains the structured data, and the body contains the main text.

-   **Blog Posts**: To add or edit a blog post, create or modify a `.md` file in the `posts/` directory. The filename will be used as the URL slug.

## Deployment

This project is ready to be deployed on any platform that supports Next.js, such as:

-   [Vercel](https://vercel.com/): The easiest way to deploy a Next.js application.
-   [Firebase App Hosting](https://firebase.google.com/docs/app-hosting): Pre-configured with an `apphosting.yaml` file.
-   Other platforms like Netlify, AWS Amplify, or a custom Node.js server.
