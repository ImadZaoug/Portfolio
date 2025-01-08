# Interactive Portfolio Project

This project is an interactive portfolio built with Vue.js and Three.js, featuring a game-like interface with an animated 3D avatar, skill trees, and an inventory system.

## 🚀 Getting Started

### Prerequisites
- Node.js v18 or higher
- Docker and Docker Compose (optional)
- Python 3.9 (if running backend)

### Running Locally Without Docker

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio
```

2. Frontend Setup:
```bash
cd frontend
npm install
npm run serve
```
The frontend will be available at `http://localhost:8080`

3. Backend Setup (Optional):
```bash
cd backend
pip install -r requirements.txt
flask run
```
The backend will be available at `http://localhost:5000`

### Running with Docker

1. Start all services:
```bash
docker-compose up
```

2. For development with hot-reload:
```bash
docker-compose up --build
```

## 🏗️ Project Structure

The project is divided into frontend and backend components:

### Frontend Structure
- `src/components/`: Vue components
- `src/stores/`: Pinia stores for state management
- `src/views/`: Main view components
- `src/router/`: Vue Router configuration
- `src/styles/`: Global styles and utilities
- `public/`: Static assets

### Key Components
- `ThreeDAvatar.vue`: 3D character rendering and animations
- `SkillTree.vue`: Interactive skill progression system
- `InventoryDetails.vue`: Character inventory management
- `PersonalProfile.vue`: Profile information display
- `ExperienceSection.vue`: Work experience showcase

## 🔧 Making Changes

### Profile Section
To update your profile information, modify `frontend/src/stores/profile.js`:

```javascript
{
  profileImage: '/images/profile.png',  // Update profile image
  name: 'Your Name',
  title: 'Your Title',
  personalInfo: {
    'Location': 'Your Location',
    'Email': 'your.email@example.com',
    'Specialty': 'Your Specialties',
    'Experience': 'Years of Experience',
    'Languages': 'Your Languages'
  }
}
```

### Experience Section
Update work experiences in `frontend/src/stores/experience.js`:

```javascript
{
  position: 'Job Title',
  company: 'Company Name',
  location: 'Location',
  period: 'Start – End Date',
  type: 'Employment Type',
  responsibilities: [
    'Responsibility 1',
    'Responsibility 2'
  ],
  technologies: ['Tech1', 'Tech2']
}
```

### Projects Section
Modify projects in `frontend/src/stores/projects.js`:

```javascript
{
  id: 1,
  title: "Project Title",
  type: "project-type",  // Determines visualization style
  shortDesc: "Brief description",
  fullDesc: "Detailed description",
  technologies: ["Tech1", "Tech2"],
  links: {
    github: "repository-url"
  }
}
```

### Skills Section
Update skills in `frontend/src/stores/skills.js`:

```javascript
{
  id: 'skill-id',
  name: 'Skill Name',
  description: 'Skill Description',
  position: { x: coordinate, y: coordinate },
  dependencies: ['parent-skill-id'],
  cost: point-cost,
  branch: 'branch-type'
}
```

### Avatar and Animations

#### Changing the Avatar
1. Replace the model file in `public/models/`
2. Update the model path in `ThreeDAvatar.vue`:
```javascript
loader.load('/models/your-model.glb', ...)
```

#### Adding New Animations
1. Add animation files to `public/animations/`
2. Register in `ThreeDAvatar.vue`:
```javascript
const animationFiles = {
  'animationName': '/animations/your-animation.fbx'
}
```

## 🎨 Theme Customization

Modify color schemes in `frontend/src/stores/theme.js`:

```javascript
colors: {
  light: {
    primary: '#your-color',
    secondary: '#your-color',
    // ... other color values
  },
  dark: {
    // Dark theme colors
  }
}
```

## 🔑 Features and Tips

- **Cave Mode**: A special dark mode with a torch effect
- **Skill Tree**: Interactive progression system with dependencies
- **Inventory System**: Drag-and-drop skill and interest management
- **3D Avatar**: Animated character that responds to navigation
- **Responsive Design**: Adapts to different screen sizes
- **Theme Toggle**: Switch between light and dark themes

## 📝 Important Notes

1. Keep image and model files in appropriate public directories
2. Test animations thoroughly when adding new ones
3. Maintain proper dependencies in the skill tree
4. Ensure proper disposal of 3D resources to prevent memory leaks
5. Follow Vue.js and JavaScript best practices
6. Keep the backend configuration even if not using it initially

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our game mode development plans, contribution process, and coding guidelines.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 


This project is licensed under the MIT License - see the LICENSE file for details.