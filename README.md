# 🎯 Taiko Groups Map

[![Build and Deploy to GitHub Pages](https://github.com/Taiko-Community-Alliance/taiko-groups-map/actions/workflows/build.yml/badge.svg)](https://github.com/Taiko-Community-Alliance/taiko-groups-map/actions/workflows/build.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-blue?logo=github)](https://taiko-community-alliance.github.io/taiko-groups-map/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> An interactive map displaying Taiko groups and communities worldwide

## 🌍 Overview

Taiko Groups Map is a web application that visualizes Taiko drumming groups and communities around the globe. Built with modern web technologies, it provides an easy way to discover and connect with Taiko communities.

## 🚀 Live Demo

🔗 **View the map:** https://taiko-community-alliance.github.io/taiko-groups-map/

## 📋 Features

✅ **Interactive World Map** - Leaflet.js based interactive map
✅ **Group Markers** - Visual representation of Taiko groups
✅ **Filter & Search** - Find groups by location or name
✅ **Responsive Design** - Works on desktop, tablet, and mobile
✅ **Data-Driven** - Loads group data from CSV
✅ **GitHub Pages Deployment** - Automatic deployment on push to main

## 🛠️ Technology Stack

- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Mapping:** Leaflet.js
- **Build Tool:** Rollup
- **Deployment:** GitHub Pages
- **Data:** CSV format

## 📁 Project Structure

```
taiko-groups-map/
├── .github/                  # GitHub configuration
│   ├── ISSUE_TEMPLATE/       # Issue templates
│   ├── workflows/            # GitHub Actions workflows
│   ├── pull_request_template.md # PR template
│   └── CODEOWNERS            # Code ownership rules
├── public/                  # Static assets
│   ├── index.html           # Main HTML file
│   ├── styles/              # CSS files
│   ├── images/              # Image assets
│   └── ...                  # Other static files
├── src/                     # Source code
│   ├── main.js              # Main application logic
│   ├── map.js               # Map initialization
│   ├── data.js              # Data loading
│   └── utils.js             # Utility functions
├── .env.template            # Environment variables template
├── .gitignore               # Git ignore rules
├── package.json             # Project dependencies
├── rollup.config.js         # Rollup configuration
└── README.md                # Project documentation
```

## 📥 Installation & Setup

### Prerequisites

- Node.js 18+
- npm 8+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Taiko-Community-Alliance/taiko-groups-map.git
cd taiko-groups-map

# Install dependencies
npm install

# Copy environment template
cp .env.template .env

# Edit .env file if needed
nano .env
```

### Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5000
```

### Build for Production

```bash
# Build the project
npm run build

# Output will be in dist/ directory
```

### Run Tests

```bash
# Run tests (if available)
npm test
```

## 🌐 Data Format

The application loads group data from a CSV file. The expected format:

```csv
name,latitude,longitude,description,website,group_type
Taiko Community NYC,40.7128,-74.0060,New York Taiko Community,https://example.com,Community
Kodo Drummers,35.6762,139.6503,Professional Taiko Group,https://kodo.jp,Professional
```

## 🔧 Configuration

### Environment Variables

Create `.env` file from template:

```bash
cp .env.template .env
```

Edit `.env`:

```env
# Taiko Groups Data CSV URL
TAIKO_GROUPS_DATA_CSV_URL=https://raw.githubusercontent.com/Taiko-Community-Alliance/taiko-groups-data/main/groups.csv

# Map configuration
MAP_CENTER_LAT=35.6762
MAP_CENTER_LNG=139.6503
MAP_ZOOM_LEVEL=2

# Application settings
APP_TITLE=Taiko Groups Map
APP_DESCRIPTION=Find Taiko groups around the world
```

## 📤 Deployment

### GitHub Pages

The project is automatically deployed to GitHub Pages on every push to `main` branch via GitHub Actions.

**View deployment:** https://taiko-community-alliance.github.io/taiko-groups-map/

### Manual Deployment

```bash
# Build the project
npm run build

# Commit and push to main branch
git add dist/
git commit -m "Update GitHub Pages"
git push origin main
```

## 🤝 Contributing

We welcome contributions from the community! Please follow our [contribution guidelines](CONTRIBUTING.md) when submitting changes.

### Ways to Contribute

- 🐛 **Report bugs** - Use issue templates
- ✨ **Request features** - Submit feature requests
- 📚 **Improve documentation** - Update README or docs
- 💻 **Submit code** - Fix bugs or add features
- 🎨 **Design improvements** - UI/UX enhancements

### Development Workflow

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/taiko-groups-map.git
cd taiko-groups-map

# 3. Create feature branch
git checkout -b feature/your-feature-name

# 4. Make your changes
# 5. Test your changes
npm run build

# 6. Commit changes
git add .
git commit -m "Add your feature description"

# 7. Push to your fork
git push origin feature/your-feature-name

# 8. Create Pull Request
# Go to GitHub and create PR from your fork
```

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **GitHub Issues:** https://github.com/Taiko-Community-Alliance/taiko-groups-map/issues
- **GitHub Discussions:** https://github.com/Taiko-Community-Alliance/taiko-groups-map/discussions
- **Community:** Join our Taiko Community Alliance discussions

## 📊 Repository Health

![GitHub Repo Size](https://img.shields.io/github/repo-size/Taiko-Community-Alliance/taiko-groups-map)
![GitHub Stars](https://img.shields.io/github/stars/Taiko-Community-Alliance/taiko-groups-map?style=social)
![GitHub Forks](https://img.shields.io/github/forks/Taiko-Community-Alliance/taiko-groups-map?style=social)
![GitHub Issues](https://img.shields.io/github/issues/Taiko-Community-Alliance/taiko-groups-map)
![GitHub PRs](https://img.shields.io/github/issues-pr/Taiko-Community-Alliance/taiko-groups-map)

---

🎉 **Built with ❤️ for the Taiko Community**

*Last updated: $(date)*