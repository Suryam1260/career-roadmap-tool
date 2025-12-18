"""
PRIORITY DATA - Skill Priorities for All Roles

This module contains the explicit priority definitions for each target role.
Based on Scaler CRT algorithm for skill prioritization.

Priority Levels:
- HIGH: Must-have skills, critical for the role (weight: 3)
- MEDIUM: Important skills, enhances effectiveness (weight: 2)
- LOW: Nice-to-have skills, bonus/specialized (weight: 1)

Used for calculating weighted match scores in skills_analysis.py
"""

SKILL_PRIORITIES = {
    # ============================================================
    # BACKEND ENGINEERING
    # ============================================================
    "Backend Engineering": {
        "HIGH": [
            "Python",
            "Java",
            "Node.js",
            "Data Structures & Algorithms",
            "System Design",
            "SQL & Databases",
            "REST APIs",
            "Git",
        ],
        "MEDIUM": [
            "NoSQL (MongoDB/Redis)",
            "GraphQL",
            "Microservices Architecture",
            "Docker",
            "Kubernetes",
            "Message Queues (Kafka/RabbitMQ)",
            "Caching Strategies",
            "API Design & Documentation",
        ],
        "LOW": [
            "AWS/Cloud Platforms",
            "CI/CD Pipelines",
            "Authentication & Security",
            "Performance Optimization",
            "Monitoring & Logging",
            "Serverless",
        ],
    },
    # ============================================================
    # FRONTEND ENGINEERING
    # ============================================================
    "Frontend Engineering": {
        "HIGH": [
            "JavaScript",
            "TypeScript",
            "React",
            "HTML",
            "CSS",
            "State Management (Redux/Context)",
            "Responsive Design",
            "Git",
        ],
        "MEDIUM": [
            "Next.js",
            "Vue.js",
            "Angular",
            "Webpack/Vite",
            "Testing (Jest/React Testing Library)",
            "REST APIs",
            "GraphQL",
            "CSS Frameworks (Tailwind/Bootstrap)",
        ],
        "LOW": [
            "Progressive Web Apps",
            "Accessibility (WCAG)",
            "Performance Optimization",
            "Browser DevTools",
            "npm/yarn",
            "Svelte",
        ],
    },
    # ============================================================
    # SOFTWARE ENGINEERING (Full Stack)
    # ============================================================
    "Software Engineering": {
        "HIGH": [
            "JavaScript",
            "Python",
            "Data Structures & Algorithms",
            "System Design",
            "Git",
            "SQL & Databases",
            "REST APIs",
            "Problem Solving",
        ],
        "MEDIUM": [
            "React",
            "Node.js",
            "TypeScript",
            "NoSQL (MongoDB/Redis)",
            "Docker",
            "Testing (Unit/Integration)",
            "API Design",
            "Microservices",
        ],
        "LOW": [
            "Kubernetes",
            "AWS/Cloud",
            "GraphQL",
            "CI/CD",
            "Message Queues",
            "Monitoring",
            "Performance Optimization",
        ],
    },
    # ============================================================
    # MACHINE LEARNING
    # ============================================================
    "Machine Learning": {
        "HIGH": [
            "Python",
            "Mathematics (Linear Algebra/Calculus)",
            "Statistics & Probability",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "Machine Learning Algorithms",
            "Data Preprocessing",
        ],
        "MEDIUM": [
            "Deep Learning",
            "TensorFlow",
            "PyTorch",
            "Neural Networks",
            "Feature Engineering",
            "Model Evaluation",
            "Data Visualization",
            "SQL",
            "Git",
        ],
        "LOW": [
            "MLOps",
            "Model Deployment",
            "Computer Vision",
            "NLP",
            "Hyperparameter Tuning",
            "Cloud Platforms",
            "Docker",
        ],
    },
    # ============================================================
    # DATA SCIENCE
    # ============================================================
    "Data Science": {
        "HIGH": [
            "Python",
            "SQL",
            "Statistics",
            "Probability",
            "Pandas",
            "NumPy",
            "Data Visualization",
            "Jupyter Notebooks",
        ],
        "MEDIUM": [
            "Machine Learning",
            "Scikit-learn",
            "Matplotlib",
            "Seaborn",
            "Feature Engineering",
            "Model Evaluation",
            "A/B Testing",
            "R",
        ],
        "LOW": [
            "Deep Learning",
            "TensorFlow",
            "PyTorch",
            "NLP",
            "Computer Vision",
            "Big Data (Spark/Hadoop)",
            "ETL",
        ],
    },
    # ============================================================
    # DATA ANALYTICS
    # ============================================================
    "Data Analytics": {
        "HIGH": [
            "SQL",
            "Excel",
            "Data Visualization",
            "Business Intelligence",
            "Statistics",
            "Dashboard Creation",
            "Data Modeling",
        ],
        "MEDIUM": [
            "Power BI",
            "Tableau",
            "Looker",
            "Python",
            "Pandas",
            "Google Analytics",
            "A/B Testing",
            "ETL Processes",
        ],
        "LOW": [
            "R",
            "NumPy",
            "Data Warehousing",
            "Big Data Tools",
            "Machine Learning Basics",
            "Advanced Statistics",
        ],
    },
    # ============================================================
    # DEVOPS & CLOUD COMPUTING
    # ============================================================
    "DevOps & Cloud Computing": {
        "HIGH": [
            "Linux/Unix",
            "Bash Scripting",
            "Git",
            "Docker",
            "CI/CD",
            "AWS/Azure/GCP",
            "Networking Basics",
            "Monitoring & Logging",
        ],
        "MEDIUM": [
            "Kubernetes",
            "Terraform",
            "Ansible",
            "Python",
            "Jenkins/GitLab CI",
            "Infrastructure as Code",
            "Load Balancing",
            "Security Fundamentals",
        ],
        "LOW": [
            "Service Mesh",
            "Serverless",
            "Cloud Architecture",
            "Container Orchestration",
            "Advanced Networking",
            "Cost Optimization",
        ],
    },
}


def get_explicit_priorities(role_category: str) -> dict:
    """
    Get skill priorities for a given role category.

    Args:
        role_category: Role category (e.g., 'Backend Engineering')

    Returns:
        Dictionary mapping skill -> priority level
        Example: {'Python': 'HIGH', 'Docker': 'MEDIUM'}
    """
    category_data = SKILL_PRIORITIES.get(role_category, {})

    if not category_data:
        return {}

    priorities_map = {}

    # Map HIGH priority skills
    for skill in category_data.get("HIGH", []):
        priorities_map[skill] = "HIGH"

    # Map MEDIUM priority skills
    for skill in category_data.get("MEDIUM", []):
        priorities_map[skill] = "MEDIUM"

    # Map LOW priority skills
    for skill in category_data.get("LOW", []):
        priorities_map[skill] = "LOW"

    return priorities_map


def get_all_skills_for_role(role_category: str) -> list:
    """
    Get all skills for a role (sorted by priority: HIGH → MEDIUM → LOW).

    Args:
        role_category: Role category (e.g., 'Backend Engineering')

    Returns:
        List of skill names
    """
    category_data = SKILL_PRIORITIES.get(role_category, {})

    if not category_data:
        return []

    # Return in priority order
    return (
        category_data.get("HIGH", [])
        + category_data.get("MEDIUM", [])
        + category_data.get("LOW", [])
    )


def get_priority_weight(priority: str) -> int:
    """
    Get weight for priority level (used in match score calculation).

    Args:
        priority: 'HIGH', 'MEDIUM', or 'LOW'

    Returns:
        Weight value (3, 2, or 1)
    """
    weights = {"HIGH": 3, "MEDIUM": 2, "LOW": 1}

    return weights.get(priority, 1)


def get_available_roles() -> list:
    """
    Get list of all available role categories.

    Returns:
        List of role category names
    """
    return list(SKILL_PRIORITIES.keys())
