#!/bin/bash

# Create Project Pulse Export Script
# Save this as setup-project-pulse.sh and run with: bash setup-project-pulse.sh

echo "🚀 Setting up Project Pulse..."

# Create project directory
mkdir -p project-pulse
cd project-pulse

# Initialize Next.js project
echo "📦 Initializing Next.js project..."
npx create-next-app@latest . --typescript --tailwind --app --no-git --import-alias "@/*"

# Install dependencies
echo "📥 Installing dependencies..."
npm install lucide-react date-fns clsx tailwind-merge @headlessui/react

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p app/projects/\[id\]
mkdir -p app/projects/new
mkdir -p app/dashboard
mkdir -p app/api/projects/\[id\]
mkdir -p app/api/notifications
mkdir -p components/projects
mkdir -p components/ui
mkdir -p components/notifications
mkdir -p components/layout
mkdir -p lib
mkdir -p hooks
mkdir -p public

# Create a setup instructions file
cat > SETUP_INSTRUCTIONS.md << 'EOF'
# Project Pulse Setup Instructions

## ✅ Project Created Successfully!

### Next Steps:

1. **Copy the code files** from the Claude conversation into their respective locations:
   - lib/types.ts
   - lib/constants.ts
   - lib/utils.ts
   - lib/mock-data.ts
   - app/page.tsx
   - app/globals.css
   - app/layout.tsx
   - app/projects/page.tsx
   - app/projects/new/page.tsx
   - app/projects/[id]/page.tsx
   - app/dashboard/page.tsx
   - components/ui/Button.tsx
   - components/ui/Input.tsx
   - components/ui/Select.tsx
   - components/ui/Badge.tsx
   - components/ui/Progress.tsx
   - components/ui/Modal.tsx
   - components/projects/ProjectCard.tsx
   - components/projects/ProjectForm.tsx
   - components/projects/ProjectList.tsx
   - components/projects/ProjectFilters.tsx
   - components/notifications/NotificationBell.tsx
   - components/notifications/NotificationList.tsx
   - components/layout/Header.tsx
   - components/layout/Sidebar.tsx
   - hooks/useProjects.ts
   - hooks/useNotifications.ts

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser** to http://localhost:3000

### GitHub Upload:

1. Initialize git repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Project Pulse"
   ```

2. Create a new repository on GitHub

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/project-pulse.git
   git branch -M main
   git push -u origin main
   ```

### Features Included:
- ✅ Mobile-responsive design
- ✅ Project CRUD operations
- ✅ Real-time notifications
- ✅ Role-based access
- ✅ Analytics dashboard
- ✅ Deadline warnings
- ✅ Extension requests

EOF

echo "✅ Setup complete! Check SETUP_INSTRUCTIONS.md for next steps."
echo "📂 Project created in: $(pwd)"