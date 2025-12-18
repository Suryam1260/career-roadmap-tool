/**
 * SKILL DESCRIPTIONS
 *
 * Comprehensive mapping of ALL skill names to brief 2-5 word descriptions.
 * Extracted from all 30 persona files across entry/mid/senior levels and all roles.
 *
 * Used for:
 * - Tooltips in skill selection UI
 * - Skill cards on roadmap pages
 * - Quick reference for users
 *
 * Format: { "Exact Skill Name from Persona": "2-5 word description" }
 */

export const skillDescriptions = {
  // ===== FRONTEND - CORE =====
  "HTML5": "Modern semantic markup language",
  "CSS3": "Styling and layout language",
  "CSS3 Fundamentals": "Core styling fundamentals",
  "JavaScript ES6+": "Modern JavaScript features",
  "React": "Component-based UI library",
  "React Basics": "Core React fundamentals",
  "React Advanced Patterns": "Advanced component architecture",
  "Advanced React Patterns": "Compound components patterns",
  "React Hooks": "State and lifecycle management",
  "React Hooks & Custom Hooks": "Reusable stateful logic",
  "React Hooks (useState, useEffect)": "Core React hooks",
  "React Query/SWR": "Server state management",
  "React Server Components": "Server-rendered React",
  "React/Vue/Angular (Advanced)": "Expert framework knowledge",
  "TypeScript": "Typed JavaScript superset",
  "TypeScript Basics": "Static typing fundamentals",
  "TypeScript Advanced": "Advanced type patterns",
  "TypeScript Advanced Patterns": "Generic constraints mappings",
  "Next.js": "React production framework",
  "Next.js Basics": "SSR file-based routing",
  "Next.js 14 & React Server Components": "Latest Next.js features",
  "Next.js/Remix": "Full-stack React frameworks",

  // ===== FRONTEND - STATE & DATA =====
  "State Management (Redux/Zustand)": "Global state management",
  "State Management (Redux/Zustand/Jotai)": "Modern state libraries",
  "State Management (Redux/Context)": "Application state patterns",
  "State Management (Context API)": "React context patterns",
  "State Management Architecture (Zustand/Jotai)": "State architecture design",
  "Redux or Zustand": "State management choice",
  "API Integration": "Connect external services",
  "API Integration & Error Handling": "Robust API integration",
  "REST API Integration": "Consume RESTful APIs",

  // ===== FRONTEND - STYLING =====
  "Responsive Design": "Mobile-first adaptive layouts",
  "Responsive Design & CSS": "Cross-device compatibility",
  "Responsive Design & Mobile-First": "Mobile-first design",
  "Flexbox & Grid": "Modern CSS layout",
  "Flexbox & CSS Grid": "Advanced layout techniques",
  "Tailwind CSS": "Utility-first CSS framework",
  "Tailwind CSS or Bootstrap": "CSS framework choice",
  "CSS-in-JS & Styled Components": "Component-scoped styling",
  "CSS-in-JS (Styled Components/Emotion)": "Runtime CSS solutions",
  "CSS Animations": "Motion and transitions",
  "CSS Animations & Transitions": "Smooth UI animations",
  "CSS Preprocessors (Sass/SCSS)": "Extended CSS syntax",
  "Advanced CSS (Grid/Flexbox/Animations)": "Modern CSS mastery",
  "Advanced CSS (Sass/SCSS)": "Sass mixins functions",
  "Advanced CSS Architecture": "Scalable CSS patterns",

  // ===== FRONTEND - COMPONENTS =====
  "Component Architecture": "Reusable component design",
  "Component Design Patterns": "Composition HOC patterns",
  "Component Libraries (Material-UI, Chakra)": "Pre-built UI libraries",
  "Design Systems": "Reusable component libraries",
  "Design Systems Architecture": "Design system strategy",
  "Design Token Systems": "Design variable management",
  "Storybook & Component Documentation": "Component documentation",
  "Storybook for Component Documentation": "Visual component library",

  // ===== FRONTEND - ACCESSIBILITY =====
  "Web Accessibility (WCAG)": "Inclusive design practices",
  "Web Accessibility (WCAG 2.1)": "WCAG 2.1 compliance",
  "Web Accessibility Basics": "Fundamental accessibility",
  "Accessibility (WCAG 2.1 AA/AAA)": "Advanced accessibility standards",
  "Accessibility Automation (Axe, Lighthouse)": "Automated accessibility testing",
  "Accessibility Leadership (WCAG)": "Drive accessibility initiatives",
  "WCAG 2.1 Compliance": "Accessibility standard adherence",
  "Assistive Technology Testing": "Screen reader testing",
  "Semantic HTML & SEO": "SEO-friendly markup",

  // ===== FRONTEND - PERFORMANCE =====
  "Core Web Vitals Optimization": "Google performance metrics",
  "Core Web Vitals (LCP, INP, CLS)": "Loading interactivity metrics",
  "Core Web Vitals (LCP/INP/CLS)": "User experience metrics",
  "Core Web Vitals Mastery": "Expert performance optimization",
  "Performance Optimization": "Speed efficiency improvements",
  "Performance Optimization at Scale": "Optimize large applications",
  "Performance Profiling": "Identify bottlenecks",
  "Performance Profiling & Lighthouse": "Audit and optimize",
  "Advanced Performance Profiling": "Deep performance analysis",
  "Runtime Performance Monitoring": "Track live performance",
  "Web Performance Optimization": "Speed optimization techniques",
  "Web Performance Auditing": "Measure and improve",

  // ===== FRONTEND - BUILD & TOOLS =====
  "Browser DevTools": "Chrome DevTools proficiency",
  "Browser DevTools & Debugging": "Debug and profile",
  "Webpack/Vite": "Module bundlers",
  "Webpack/Vite Build Tools": "Modern build tooling",
  "Build Tools (Vite, Webpack Basics)": "Bundle optimization basics",
  "Build Tools (Webpack/Vite/Turbopack)": "Next-gen bundlers",
  "Build Optimization": "Reduce bundle size",
  "Build Tool Optimization": "Optimize build pipelines",
  "Bundle Optimization & Code Splitting": "Lazy loading strategies",
  "Bundle Analysis & Code Splitting": "Analyze and split",
  "DOM Manipulation": "Direct DOM operations",
  "Form Validation": "Client-side input validation",
  "NPM & Package Management": "Node package manager",

  // ===== FRONTEND - ADVANCED =====
  "Module Federation": "Micro-frontend architecture",
  "Module Federation & Code Splitting": "Share code apps",
  "Micro Frontends": "Independent frontend modules",
  "Micro-Frontends": "Distributed frontend architecture",
  "Web Components": "Native custom elements",
  "Web Components & Custom Elements": "Standards-based components",
  "Progressive Web Apps": "Offline-capable web apps",
  "Progressive Web Apps (PWA)": "Native-like web experiences",
  "Progressive Web Apps (PWAs)": "Installable web apps",
  "Mobile-First PWA Development": "Mobile-optimized PWAs",
  "Server-Side Rendering": "SSR for SEO",
  "Server-Side Rendering (SSR)": "Pre-render on server",
  "Server Components & SSR": "React server rendering",
  "Frontend System Design": "Architect frontend systems",
  "Frontend Infrastructure as Code": "Automate frontend infrastructure",
  "Frontend Security Best Practices": "Secure frontend apps",
  "Cross-Platform Development (React Native)": "Mobile app development",
  "Web Animations & Interactions": "Engaging user interactions",
  "Framer Motion & Advanced Animations": "React animation library",
  "AI/ML Integration in Frontend": "ML models browser",
  "WebAssembly (WASM)": "High-performance web code",
  "WebAssembly (WASM) Basics": "Compile to assembly",
  "WebAssembly & Edge Computing": "Edge performance optimization",
  "Web Workers & Service Workers": "Background processing",
  "Monorepo Management (Nx/Turborepo)": "Multi-package repositories",

  // ===== FRONTEND - TESTING =====
  "Testing (Jest/React Testing Library)": "React component testing",
  "Testing (Jest/Vitest/Playwright)": "Modern testing stack",
  "Testing (Jest/Vitest/Cypress)": "Comprehensive testing tools",
  "Testing (Jest Basics)": "Unit testing fundamentals",
  "End-to-End Testing (Playwright/Cypress)": "Full user flows",
  "E2E Testing (Playwright/Cypress)": "Automated browser testing",
  "Jest & React Testing Library": "React testing practices",

  // ===== BACKEND - CORE =====
  "Node.js": "JavaScript runtime environment",
  "Node.js & Express": "Node.js web framework",
  "Node.js & Express.js": "Server-side JavaScript",
  "Node.js/Express": "Backend JavaScript stack",
  "Node.js/Python/Java": "Backend language options",
  "Express.js": "Minimal Node.js framework",
  "Express.js/Fastify": "Fast Node.js frameworks",
  "Express.js/Flask/Spring Boot": "Backend framework options",
  "Python": "Versatile programming language",
  "Python Basics": "Python fundamentals",
  "Python (Advanced)": "Advanced Python techniques",
  "Python Scripts & Automation": "Automate with Python",
  "Python Scripting": "Write automation scripts",
  "Python for DevOps": "DevOps automation",
  "Python for Data Engineering": "Data processing",
  "Python/Bash Scripting": "Shell Python scripting",
  "Python/Go for Automation": "Automation language choices",
  "Python/Go/Java (Advanced)": "Multi-language expertise",
  "Python/JavaScript Basics": "Dual language skills",
  "Java": "Enterprise programming language",
  "Django/Flask (Python)": "Python web frameworks",
  "Middleware": "Request processing pipeline",
  "Middleware & Request Processing": "Backend request handling",

  // ===== BACKEND - APIs =====
  "REST APIs": "RESTful web services",
  "REST API Design": "Design scalable APIs",
  "RESTful API Design": "REST architectural patterns",
  "API Design": "Design robust APIs",
  "API Design & Best Practices": "API architecture standards",
  "API Design & GraphQL": "Modern API paradigms",
  "API Design & Integration": "Build consume APIs",
  "API Design (REST/GraphQL)": "Choose API style",
  "API Design Principles": "RESTful best practices",
  "API Gateway Patterns": "Centralize API management",
  "API Gateway & Ingress Controllers": "Route secure APIs",
  "API Rate Limiting & Throttling": "Control API usage",
  "API Security": "Secure API endpoints",
  "API Security Best Practices": "OWASP API security",
  "API Testing (Postman/curl)": "Test API endpoints",
  "Cross-Team API Design": "Design cross-functional APIs",
  "Platform API Design": "Platform-level APIs",
  "GraphQL": "Query language APIs",
  "GraphQL Basics": "GraphQL fundamentals",
  "GraphQL & API Design": "Modern API design",
  "GraphQL & Advanced APIs": "Advanced GraphQL patterns",
  "GraphQL & Apollo Client": "GraphQL client integration",
  "GraphQL API Development": "Build GraphQL servers",

  // ===== BACKEND - AUTHENTICATION =====
  "Authentication & Authorization": "Secure user access",
  "Authentication & JWT": "Token-based auth",
  "Authentication (JWT, OAuth)": "Modern auth patterns",
  "JWT Authentication": "JSON Web Tokens",

  // ===== BACKEND - ERROR & VALIDATION =====
  "Error Handling": "Graceful error management",
  "Error Handling & Logging": "Track handle errors",
  "Error Handling & Validation": "Input validation errors",
  "Debugging Techniques": "Find fix bugs",

  // ===== BACKEND - ARCHITECTURE =====
  "Microservices": "Distributed service architecture",
  "Microservices Architecture": "Design microservices",
  "Microservices Basics": "Microservice fundamentals",
  "Microservices Concepts": "Service decomposition",
  "Event-Driven Architecture": "Event-based systems",
  "Event-Driven Architectures": "Async event processing",
  "Serverless Architecture": "Function as Service",
  "Serverless & FaaS (Lambda, Cloud Functions)": "Serverless computing",
  "AWS Lambda (Serverless)": "AWS serverless functions",
  "Edge Computing & Serverless": "Distributed computing",
  "Domain-Driven Design (DDD)": "Business-focused design",
  "Multi-Tenant Architecture": "Shared infrastructure design",

  // ===== BACKEND - MESSAGING =====
  "Message Queues": "Asynchronous messaging",
  "Message Queues (Kafka, RabbitMQ)": "Message broker options",
  "Message Queues (Kafka/RabbitMQ)": "Async communication",
  "Message Queues (RabbitMQ/Kafka basics)": "Queue basics",
  "Message Queues (RabbitMQ/Kafka)": "Message queue systems",
  "Message Queue Systems (Kafka, RabbitMQ)": "Enterprise messaging",

  // ===== BACKEND - REAL-TIME =====
  "WebSockets": "Real-time bidirectional communication",
  "WebSockets & Real-time": "Live updates",
  "WebSockets & Real-time Communication": "Real-time data sync",
  "WebSocket & Real-time Communication": "Push notifications",
  "Web Sockets": "Two-way communication",

  // ===== BACKEND - SECURITY =====
  "Security Best Practices": "Secure coding practices",
  "Security Best Practices (OWASP)": "OWASP Top 10",
  "Security Best Practices (XSS/CSRF)": "Prevent web attacks",
  "Web Security (XSS/CSRF/CSP)": "Frontend security",
  "DevSecOps (SAST/DAST)": "Shift-left security",

  // ===== BACKEND - TESTING =====
  "Testing (Unit Tests)": "Unit test coverage",
  "Testing (Jest/Cypress)": "Full-stack testing",
  "Testing (Jest/Mocha)": "JavaScript testing frameworks",
  "Testing Basics (Jest/Mocha)": "Test fundamentals",
  "Testing Strategy & Architecture": "Design test strategies",
  "Testing Strategies (E2E/Integration)": "Multi-layer testing",
  "Unit & Integration Testing": "Comprehensive test coverage",
  "Postman & API Testing": "API testing tools",
  "Postman/Thunder Client": "REST client tools",

  // ===== BACKEND - CONFIG =====
  "Environment Variables": "Configuration management",
  "Environment Variables & Config": "App configuration",
  "HTTP Methods": "GET POST PUT DELETE",
  "HTTP & Web Basics": "HTTP protocol fundamentals",
  "HTTP & Web Fundamentals": "Web communication basics",
  "CRUD Operations": "Create Read Update Delete",
  "JSON & Data Formats": "Data serialization",

  // ===== BACKEND - LOAD BALANCING =====
  "Load Balancing": "Distribute traffic",
  "Load Balancing & High Availability": "Ensure uptime",
  "Load Balancing & Reverse Proxy": "Traffic distribution",
  "Load Balancing & Scaling": "Scale horizontally",
  "Load Balancing & Traffic Management": "Manage traffic flows",
  "Load Balancing Basics": "Load balancer fundamentals",
  "Load Balancers & Ingress": "Kubernetes traffic routing",
  "Nginx/Apache": "Web server software",
  "Nginx/Load Balancing": "Nginx load balancer",

  // ===== BACKEND - MISC =====
  "Full-Stack Frameworks (Next.js, NestJS)": "Integrated full-stack tools",

  // ===== DATABASES - SQL =====
  "SQL": "Structured query language",
  "SQL Basics (PostgreSQL/MySQL)": "Relational database queries",
  "SQL Fundamentals": "Core SQL concepts",
  "SQL & Database Design": "Schema design",
  "SQL & PostgreSQL": "PostgreSQL database",
  "SQL (Advanced)": "Complex SQL queries",
  "SQL Joins & Aggregations": "Multi-table queries",
  "SQL Query Optimization": "Optimize query performance",
  "Advanced SQL": "Window functions CTEs",
  "Advanced SQL Optimization": "Expert query tuning",
  "Query Optimization": "Improve query speed",
  "PostgreSQL": "Advanced open-source database",
  "PostgreSQL/MySQL": "Popular SQL databases",

  // ===== DATABASES - NoSQL =====
  "MongoDB": "Document-based NoSQL",
  "MongoDB Basics": "NoSQL fundamentals",
  "MongoDB/NoSQL": "Document database",
  "NoSQL (MongoDB)": "Flexible schema database",
  "NoSQL Basics (MongoDB)": "Non-relational databases",
  "NoSQL Databases": "Non-relational data stores",
  "NoSQL Databases (MongoDB, Cassandra)": "Distributed NoSQL",
  "NoSQL at Scale (Cassandra/MongoDB)": "Scalable NoSQL",

  // ===== DATABASES - DESIGN =====
  "Database Design": "Schema and relationships",
  "Database Design & Optimization": "Efficient database design",
  "Database Design (SQL & NoSQL)": "Multi-paradigm design",
  "Database Design Basics": "Normalization fundamentals",
  "Database Relationships": "Foreign keys joins",
  "Database Indexing": "Speed up queries",
  "Database Optimization & Indexing": "Performance tuning",
  "Database Sharding": "Horizontal partitioning",
  "Database Administration (SQL, NoSQL)": "Manage databases",
  "Database Architecture (SQL & NoSQL)": "Design data architecture",

  // ===== DATABASES - CACHING =====
  "Redis": "In-memory data store",
  "Redis & Caching": "Fast caching layer",
  "Redis Caching": "Cache frequently accessed",
  "Redis/Caching": "Memory caching",
  "Redis/Caching Basics": "Basic caching patterns",
  "Caching Strategies (Redis)": "Optimize with caching",
  "Caching Strategies (Redis, CDN)": "Multi-layer caching",
  "Caching Strategies (Redis, Memcached)": "Cache architecture",
  "Caching Strategies (Redis/Memcached)": "Distributed caching",

  // ===== DATABASES - WAREHOUSING =====
  "Data Warehousing": "Centralized data repository",
  "Data Warehousing Basics": "Warehouse fundamentals",
  "Data Warehouse Concepts": "OLAP and analytics",
  "Data Modeling": "Design data structures",
  "Data Modeling at Scale": "Large-scale data modeling",
  "Dimensional Modeling": "Star snowflake schemas",
  "Dimensional Modeling (Star/Snowflake)": "Analytical data models",
  "Star Schema Design": "Fact dimension tables",
  "Cloud Data Warehouses (Snowflake/BigQuery)": "Modern data warehouses",
  "BigQuery": "Google BigQuery warehouse",
  "Snowflake": "Cloud data warehouse",
  "Snowflake Basics": "Snowflake fundamentals",
  "Snowflake/BigQuery": "Cloud warehouse options",
  "Databricks": "Unified analytics platform",
  "DuckDB": "Embedded analytical database",

  // ===== DATABASES - ADVANCED =====
  "Graph Databases": "Relationship-focused databases",
  "Graph Databases (Neo4j)": "Graph data modeling",
  "AWS S3 & RDS Basics": "AWS storage databases",
  "Cloud Storage (S3/GCS)": "Object storage",
  "Delta Lake": "ACID data lakes",
  "Delta Lake / Apache Iceberg": "Table formats lakes",
  "Apache Iceberg": "Table format lakes",
  "Data Lake Architecture": "Raw data storage",
  "Data Lakehouse Architecture": "Hybrid lake warehouse",

  // ===== DATA ENGINEERING - CORE =====
  "Pandas": "Python data manipulation",
  "Pandas & NumPy": "Numerical computing",
  "Data Cleaning": "Prepare raw data",
  "Data Structures (Arrays, Objects)": "Basic data structures",
  "Data Structures Basics": "Fundamental data structures",
  "Data Visualization (Matplotlib)": "Create charts",
  "Data Visualization (Matplotlib/Seaborn)": "Statistical plotting",
  "CSV/JSON Data Formats": "Common data formats",
  "CSV/JSON Data Handling": "Parse export data",

  // ===== DATA ENGINEERING - ETL =====
  "ETL Basics": "Extract Transform Load",
  "ETL Fundamentals": "ETL pipeline fundamentals",
  "ETL Pipelines": "Automated data pipelines",
  "ETL at Scale": "Large-scale ETL",
  "ETL/ELT Design": "Data pipeline architecture",

  // ===== DATA ENGINEERING - ORCHESTRATION =====
  "Apache Airflow": "Workflow orchestration",
  "Apache Airflow Basics": "Airflow DAG basics",
  "Airflow Production": "Production-grade Airflow",
  "Orchestration (Airflow/Dagster/Prefect)": "Pipeline orchestration tools",
  "Data Pipeline Orchestration": "Coordinate data workflows",

  // ===== DATA ENGINEERING - BIG DATA =====
  "Apache Spark": "Distributed data processing",
  "Apache Spark Basics": "Spark fundamentals",
  "Apache Spark (Advanced)": "Advanced Spark optimization",
  "Apache Spark (PySpark)": "Python Spark API",
  "PySpark": "Python Spark programming",
  "Spark Optimization": "Optimize Spark jobs",

  // ===== DATA ENGINEERING - STREAMING =====
  "Apache Kafka": "Event streaming platform",
  "Apache Kafka & Event Streaming": "Real-time data streams",
  "Kafka Basics": "Kafka fundamentals",
  "Kafka/Streaming Basics": "Stream processing basics",
  "Apache Flink": "Stream processing framework",
  "Apache Flink for Stream Processing": "Stateful stream processing",
  "Real-time Streaming": "Live data processing",
  "Real-time Streaming (Spark Streaming/Flink)": "Stream processing engines",
  "Real-time Streaming Architecture": "Design streaming systems",
  "Real-Time Data Processing": "Process data motion",
  "Real-time Data Processing": "Low-latency processing",
  "Real-time Analytics": "Instant insights",
  "Stream Processing Optimization": "Optimize streaming pipelines",

  // ===== DATA ENGINEERING - QUALITY =====
  "Data Quality & Validation": "Ensure data accuracy",
  "Data Quality Engineering": "Build quality checks",
  "Data Quality Frameworks": "Systematic quality assurance",
  "Data Quality Testing": "Validate data pipelines",
  "Data Pipeline Monitoring": "Monitor pipeline health",
  "Data Observability (Monte Carlo/Datadog)": "Data pipeline observability",

  // ===== DATA ENGINEERING - DBT =====
  "dbt (data build tool)": "Transform data warehouse",
  "dbt (Data Build Tool)": "SQL transformation tool",
  "dbt Advanced": "Advanced dbt patterns",

  // ===== DATA ENGINEERING - DATAOPS =====
  "DataOps & CI/CD": "Automate data workflows",
  "CI/CD for Data Pipelines": "Deploy data pipelines",

  // ===== DATA ENGINEERING - ARCHITECTURE =====
  "Data Mesh": "Decentralized data architecture",
  "Data Mesh Architecture": "Domain-oriented data",
  "Data Mesh Principles": "Data as product",
  "Data Fabric": "Unified data integration",
  "Data Fabric Architecture": "Integrated data layer",

  // ===== DATA ENGINEERING - GOVERNANCE =====
  "Data Governance": "Data policy enforcement",
  "Data Governance Frameworks": "Enterprise data governance",
  "Data Security & Compliance": "Protect sensitive data",
  "Data Security & Encryption": "Encrypt data rest",
  "Data Catalog Tools": "Discover data assets",
  "Data Cataloging": "Metadata management",
  "Data Cataloging (DataHub/Amundsen)": "Data discovery tools",
  "Data Contracts & Schema Evolution": "API contracts data",
  "Data Strategy & Roadmapping": "Plan data initiatives",
  "Data Platform Engineering": "Build data platforms",

  // ===== DATA ENGINEERING - ML =====
  "ML Pipelines (MLOps)": "Machine learning pipelines",
  "MLOps & Feature Stores": "Production ML infrastructure",
  "MLOps & ML Pipeline Management": "Manage ML lifecycle",
  "ML Feature Store (Feast/Tecton)": "Feature engineering",

  // ===== DATA ENGINEERING - ADVANCED =====
  "Change Data Capture (CDC)": "Track data changes",
  "Distributed Data Systems": "Scale data systems",
  "Distributed Systems for Data": "Distributed data processing",
  "AWS (S3, Glue, EMR)": "AWS data services",
  "AWS/GCP Data Services": "Cloud data platforms",
  "Google BigQuery": "Google cloud warehouse",
  "Jupyter Notebooks": "Interactive data analysis",
  "Scala/Java": "JVM data engineering",

  // ===== DEVOPS - LINUX =====
  "Linux": "Open-source operating system",
  "Linux Fundamentals": "Core Linux skills",
  "Linux Administration": "Manage Linux servers",
  "Linux Advanced Administration": "Expert Linux operations",
  "Linux System Administration": "System maintenance",
  "Linux Command Line": "Shell commands",
  "Basic Linux Commands": "Essential CLI commands",
  "Bash Scripting": "Shell script automation",
  "SSH & Remote Access": "Secure remote connections",
  "SSH & Security Basics": "Encrypted access",

  // ===== DEVOPS - VERSION CONTROL =====
  "Git": "Version control system",
  "Git & Version Control": "Track code changes",
  "Git & GitHub": "Collaborative development",
  "Git Advanced Workflows": "Branching strategies",
  "Git Workflows & Code Reviews": "Team collaboration",
  "Git & GitOps (Argo CD, Flux)": "GitOps methodology",

  // ===== DEVOPS - CONTAINERS =====
  "Docker": "Container platform",
  "Docker & Containerization": "Package applications",
  "Docker & Kubernetes": "Container orchestration",
  "Docker Basics": "Container fundamentals",
  "Docker Compose": "Multi-container apps",
  "Docker Production": "Production container strategy",
  "Container Registries (Docker Hub/ECR)": "Store container images",
  "Container Security": "Secure containers",
  "Container Security (Trivy/Aqua/Snyk)": "Container vulnerability scanning",
  "Container Security Scanning (Trivy, Aqua)": "Image security tools",

  // ===== DEVOPS - KUBERNETES =====
  "Kubernetes": "Container orchestration",
  "Kubernetes Basics": "K8s fundamentals",
  "Kubernetes Fundamentals": "Core K8s concepts",
  "Kubernetes Production": "Production K8s clusters",
  "Kubernetes (Production Clusters)": "Enterprise K8s",
  "Kubernetes & Container Orchestration": "Orchestrate at scale",
  "Kubernetes at Scale": "Large-scale K8s",
  "Multi-Cluster Kubernetes Management": "Manage multiple clusters",
  "Multi-Cluster Management": "Cross-cluster orchestration",
  "Helm Charts": "Kubernetes package manager",
  "Helm Charts for Kubernetes": "Template K8s manifests",
  "Service Mesh (Istio)": "Microservice networking",
  "Service Mesh (Istio, Linkerd)": "Service-to-service communication",
  "Service Mesh (Istio/Linkerd)": "Manage microservice traffic",

  // ===== DEVOPS - CI/CD =====
  "CI/CD": "Continuous integration delivery",
  "CI/CD & DevOps": "Automated delivery",
  "CI/CD & DevOps Practices": "DevOps principles",
  "CI/CD (GitLab/GitHub Actions/Jenkins)": "CI/CD tool choices",
  "CI/CD Advanced (Jenkins/GitLab/ArgoCD)": "Advanced pipelines",
  "CI/CD Basics": "Pipeline fundamentals",
  "CI/CD Basics (GitHub Actions)": "GitHub automation",
  "CI/CD Fundamentals": "Core CI/CD concepts",
  "CI/CD Pipeline Design": "Design delivery pipelines",
  "CI/CD Pipeline Management": "Manage pipelines",
  "CI/CD Pipelines": "Automated build deploy",
  "CI/CD Pipelines (GitHub Actions)": "GitHub Actions pipelines",
  "CI/CD Pipelines (Jenkins, GitLab CI, GitHub Actions)": "CI/CD platforms",
  "Advanced CI/CD Patterns": "Complex pipeline patterns",
  "CI/CD for Frontend": "Frontend deployment pipelines",
  "Jenkins": "CI/CD automation server",
  "Jenkins Basics": "Jenkins fundamentals",
  "GitHub Actions": "GitHub workflow automation",
  "GitLab CI/CD": "GitLab pipelines",
  "ArgoCD": "GitOps continuous delivery",
  "ArgoCD (GitOps)": "Kubernetes GitOps",
  "GitOps (ArgoCD/Flux)": "Git-based deployments",
  "GitOps (ArgoCD/FluxCD)": "Declarative deployments",

  // ===== DEVOPS - INFRASTRUCTURE AS CODE =====
  "Terraform": "Infrastructure as Code",
  "Terraform (Infrastructure as Code)": "Provision with code",
  "Terraform Basics": "Terraform fundamentals",
  "Terraform/IaC": "Automate infrastructure",
  "Infrastructure as Code (Terraform)": "IaC with Terraform",
  "Infrastructure as Code (Terraform/CloudFormation)": "Multi-cloud IaC",
  "Ansible": "Configuration management",
  "Ansible Basics": "Ansible fundamentals",
  "Ansible/Chef/Puppet": "Config management tools",
  "Configuration Management (Ansible, Chef)": "Automate configuration",
  "Configuration Management (Chef/Puppet)": "Legacy config tools",

  // ===== DEVOPS - CLOUD =====
  "AWS/Cloud": "Amazon Web Services",
  "AWS/Cloud Basics": "AWS fundamentals",
  "AWS/Cloud Fundamentals": "Core cloud services",
  "AWS/Cloud Services": "AWS service portfolio",
  "AWS Basics (EC2, S3)": "Core AWS services",
  "AWS Fundamentals (EC2, S3)": "AWS compute storage",
  "AWS/Azure/GCP": "Multi-cloud platforms",
  "AWS/Azure/GCP (Multi-Cloud)": "Multi-cloud strategy",
  "AWS/Azure/GCP Basics": "Cloud platform basics",
  "AWS/GCP Basics": "AWS GCP fundamentals",
  "AWS/GCP/Azure Advanced": "Advanced cloud skills",
  "Azure Fundamentals": "Microsoft Azure basics",
  "Azure DevOps": "Azure CI/CD platform",
  "Cloud Basics (AWS/GCP/Azure)": "Cloud fundamentals",
  "Cloud Platforms (AWS/Azure/GCP)": "Cloud platform options",
  "Cloud Platform Architecture (AWS/Azure/GCP)": "Design cloud architecture",
  "Cloud Platform Expertise (AWS/Azure/GCP)": "Multi-cloud expertise",
  "Cloud Architecture (AWS/Azure/GCP)": "Cloud system design",
  "Cloud Architecture (AWS/GCP/Azure)": "Cloud-native architecture",
  "Multi-Cloud Architecture": "Multi-cloud design",
  "Multi-Cloud Strategy": "Avoid vendor lock-in",

  // ===== DEVOPS - NETWORKING =====
  "Networking & Security": "Network security fundamentals",
  "Networking Basics": "TCP/IP fundamentals",
  "Networking Fundamentals": "Network protocols",
  "Networking Fundamentals (TCP/IP, DNS, Load Balancing)": "Core networking",
  "Advanced Networking (BGP/VPN)": "Enterprise networking",

  // ===== DEVOPS - MONITORING =====
  "Monitoring & Logging": "Track system health",
  "Monitoring & Logging (ELK, Datadog)": "Observability stack",
  "Monitoring & Observability": "System visibility",
  "Monitoring & Observability (Prometheus, Grafana)": "Metrics and dashboards",
  "Monitoring & Observability (Prometheus/Grafana)": "Open-source monitoring",
  "Observability & Monitoring": "Full system observability",
  "Observability Stack (Prometheus/Grafana)": "Complete observability",
  "Basic Monitoring (Logs)": "Log aggregation",
  "Basic Monitoring (Prometheus/Grafana)": "Metrics basics",
  "Prometheus & Grafana": "Metrics and visualization",
  "ELK Stack (Elasticsearch, Logstash, Kibana)": "Log management",
  "ELK/EFK Stack": "Logging infrastructure",
  "Logging (ELK Stack Basics)": "Centralized logging",
  "Logging Stack (ELK/EFK, Loki)": "Log aggregation tools",
  "Infrastructure Monitoring (Datadog)": "Infrastructure observability",
  "Infrastructure Monitoring (Datadog/New Relic)": "APM tools",
  "Distributed Tracing": "Trace requests",
  "Distributed Tracing (Jaeger)": "OpenTracing implementation",
  "Distributed Tracing (Jaeger, OpenTelemetry)": "Trace distributed systems",
  "Distributed Tracing (Jaeger/Zipkin)": "Request tracing tools",
  "OpenTelemetry": "Observability standard",

  // ===== DEVOPS - SRE =====
  "Incident Management": "Handle production incidents",
  "Incident Management & On-Call": "Respond to alerts",
  "Incident Management Leadership": "Lead incident response",
  "Service Level Objectives (SLOs)": "Define reliability targets",
  "Service Level Objectives (SLOs/SLIs)": "SLO/SLI metrics",
  "Service Level Objectives (SLOs/SLIs/SLAs)": "Reliability contracts",
  "SLO/SLI/SLA Design": "Design reliability metrics",
  "Error Budgets & SLO Automation": "Automate SLO tracking",
  "Chaos Engineering": "Test system resilience",
  "Chaos Engineering (Chaos Monkey, Litmus)": "Chaos testing tools",
  "Chaos Engineering (Gremlin/Chaos Mesh)": "Controlled failure injection",
  "Disaster Recovery Planning": "Plan for failures",
  "Disaster Recovery & Backup Strategies": "Business continuity",
  "Capacity Planning": "Plan resource needs",

  // ===== DEVOPS - COST & SECURITY =====
  "Cost Optimization": "Reduce cloud costs",
  "Cost Optimization & FinOps": "Cloud cost management",
  "Infrastructure Cost Optimization (FinOps)": "Financial operations",
  "FinOps & Cost Optimization": "Cloud financial management",
  "Secrets Management (Vault)": "Secure secrets storage",
  "Secrets Management (Vault, AWS Secrets Manager)": "Secrets management tools",
  "Vault/Secrets Management": "HashiCorp Vault",
  "Policy as Code (OPA)": "Enforce policies code",
  "Policy as Code (OPA, Kyverno)": "Policy enforcement tools",
  "Policy as Code (OPA/Kyverno)": "Automated policy checks",
  "Infrastructure Security & Compliance": "Secure infrastructure",
  "Infrastructure Compliance (CIS/SOC2)": "Compliance standards",
  "Zero Trust Security Architecture": "Zero trust networking",
  "Infrastructure Drift Detection": "Detect config drift",
  "Blue-Green/Canary Deployments": "Safe deployment strategies",

  // ===== DEVOPS - PLATFORM ENGINEERING =====
  "Backstage.io / Port.io": "Developer portals",
  "Backstage/Internal Developer Portals": "Self-service platforms",
  "Internal Developer Platforms (IDP)": "Platform engineering",
  "Platform Engineering & Internal Developer Platforms": "Build internal platforms",
  "Platform Engineering (Internal Developer Platforms)": "Platform as product",
  "Platform as Product": "Platform team mindset",
  "Platform Developer Tools": "Developer experience tools",
  "Developer Tooling & DX": "Improve developer experience",
  "Infrastructure Strategy": "Long-term infrastructure planning",

  // ===== DEVOPS - MISC =====
  "YAML & JSON": "Configuration file formats",
  "Deployment (Vercel/Heroku/Render)": "Deploy applications",

  // ===== SYSTEM DESIGN & ALGORITHMS =====
  "Data Structures": "Organize store data",
  "Data Structures & Algorithms": "Problem-solving fundamentals",
  "Advanced Data Structures & Algorithms": "Complex algorithms",
  "Algorithms": "Problem-solving techniques",
  "Algorithms Basics": "Algorithm fundamentals",
  "Basic Algorithms": "Sorting and searching",
  "Advanced Algorithms & Optimization": "Optimize complex problems",
  "Async JavaScript": "Promises async/await",
  "Async JavaScript (Promises, Async/Await)": "Asynchronous programming",
  "System Design Basics": "Design scalable systems",
  "System Design Fundamentals": "Core design principles",
  "System Design Patterns": "Common design patterns",
  "System Design & Scalability": "Scale system design",
  "System Architecture Design": "Architect complex systems",
  "Distributed Systems": "Design distributed architecture",
  "Scalability Patterns": "Horizontal vertical scaling",
  "Performance Optimization Basics": "Improve system performance",
  "Architectural Decision Making": "Make architecture choices",

  // ===== LEADERSHIP & SOFT SKILLS =====
  "Technical Leadership & Mentoring": "Lead engineering teams",
  "Tech Leadership & Mentoring": "Guide technical teams",
  "Technical Mentoring": "Mentor junior engineers",
  "Technical Mentorship": "Develop engineers",
  "Team Leadership & Mentoring": "Lead and mentor",
  "Team Mentoring & Coaching": "Coach team members",
  "Team Mentorship": "Guide team growth",
  "Mentoring Junior Engineers": "Develop junior talent",
  "Code Review & Mentoring": "Review and teach",
  "Code Review & Quality Standards": "Maintain code quality",
  "Code Review Best Practices": "Effective code reviews",
  "Technical Documentation": "Write clear docs",
  "Technical Documentation & ADRs": "Document architecture decisions",
  "Technical Advocacy": "Promote technical excellence",
  "Technical Interviewing & Hiring": "Evaluate candidates",
  "Technical Strategy & Roadmapping": "Plan technical direction",
  "Tech Vision & Strategy": "Set technical vision",
  "Strategic Technical Planning": "Long-term technical planning",
  "Cross-Functional Collaboration": "Work across teams",
  "Cross-Team Collaboration": "Collaborate effectively",
  "Engineering Process Improvement": "Improve team processes",
  "Compliance & Auditing": "Meet regulatory requirements",

  // ===== SPECIALIZED / ADVANCED =====
  "AI/ML Integration": "Integrate machine learning",
  "AI/ML Ops (MLflow/Kubeflow)": "ML operations",
  "Machine Learning Integration": "Add ML applications",
  "Vector Databases for AI": "Store ML embeddings",
  "Blockchain & Distributed Ledgers": "Decentralized systems",
  "Web3 & Blockchain (Optional)": "Blockchain development",
  "Web3 & Blockchain Integration": "Decentralized apps",
};

/**
 * Get description for a skill
 * @param {string} skillName - Name of the skill
 * @returns {string} Description or generic message if not found
 */
export function getSkillDescription(skillName) {
  return skillDescriptions[skillName] || `Professional development skill`;
}

/**
 * Check if a skill has a description
 * @param {string} skillName - Name of the skill
 * @returns {boolean} True if skill has a custom description
 */
export function hasSkillDescription(skillName) {
  return skillName in skillDescriptions;
}

export default {
  skillDescriptions,
  getSkillDescription,
  hasSkillDescription
};
