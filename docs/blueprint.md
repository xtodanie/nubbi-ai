# **App Name**: OnboardAI

## Core Features:

- Role Dashboard: Role-based dashboard: Separate views for admins (content upload, user management) and new hires (onboarding journey, AI tutor).
- File Upload: Drag-and-drop interface for uploading training materials with progress indicators and real-time file validation.
- AI Assistant: A conversational AI tool which answers questions based on company-specific documentation, designed to assist new hires during onboarding. The tool uses reasoning to decide when to surface relevant documents.
- Journey Tracker: Visual representation of onboarding progress with module completion status, gamified elements, and personalized feedback.
- Language Selection: Dropdown to switch between available languages (English, Spanish), ensuring a localized onboarding experience.
- Performance Dashboard: Displays key performance indicators (KPIs) related to employee onboarding, such as completion rates, quiz scores, and time to proficiency.
- Secure Authentication: Secure user authentication using Firebase Auth, with role-based access control to protect sensitive data.
- Adaptive Testing: AI-powered generation of quizzes and tests based on uploaded training materials, with adaptive difficulty levels.
- Real-time Notifications: Real-time notifications and alerts to keep users informed about important updates, deadlines, and feedback.
- GDPR Compliance: Compliance with GDPR regulations, ensuring data privacy and security for all users.
- AI Agent Integration: Secure Firebase Functions connect to AI backends (LangChain + embeddings, Pinecone, Weaviate, Chroma) for semantic question answering.
- Protected Routes: Middleware and Firestore rules to restrict access based on role (RBAC), ensuring data security.
- Test Generation and Dataset: Sample training documents to generate adaptive tests, demonstrating AI capabilities (pending, approved, completed statuses).
- Review Module: UI for trainers to review AI-generated questions, edit, and approve before deployment.
- Audit Module: Logs of sessions, answers, and questions, creating a history for each employee.
- Demo Mode: Sandbox mode to show application without compromising real data.

## Style Guidelines:

- Primary color: Delft Blue (#414066) to convey trust and sophistication, appropriate for enterprise applications.
- Background color: Battleship gray (#82816d) for a clean and professional look, providing a neutral backdrop.
- Accent color: Lime (#ceff1a) to highlight key actions and elements, such as progress indicators and calls to action.
- Use a clear, professional, sans-serif font (e.g., Inter, Montserrat) with a focus on readability and accessibility, modern feel.
- Consistent, line-style icons to represent different onboarding modules and actions, with clear visual cues.
- Clean and modular layout with clear sections for content, progress tracking, and AI assistance, ensuring ease of navigation. Modern and minimalistic design.
- Subtle transitions and animations for a smooth user experience (e.g., loading screens, progress updates), enhancing engagement.
- Use a variety of font weights and sizes to create visual hierarchy and highlight important information.
- Employ a responsive design that adapts seamlessly to different screen sizes and devices, ensuring accessibility.
- Use tooltips and labels to provide additional context for icons, enhancing usability.