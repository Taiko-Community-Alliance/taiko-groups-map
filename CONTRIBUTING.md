# 🤝 Contributing to Taiko Groups Map

We love your input! We want to make contributing to this project as easy and transparent as possible, whether you are:

- 🐛 Reporting a bug
- ✨ Requesting a new feature
- 💻 Submitting code changes
- 📚 Improving documentation
- 🎨 Enhancing the UI/UX

## 📋 Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it to understand the expectations for all contributors.

## 🌱 New Contributors

Welcome! If you're new to open source or GitHub, we recommend these resources:

- [GitHub's guide to contributing to open source](https://opensource.guide/how-to-contribute/)
- [First contributions](https://github.com/firstcontributions/first-contributions)
- [How to contribute to an open source project](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github)

## 🚀 Getting Started

### 1. Fork the Repository

Click the "Fork" button at the top-right of the repository page to create your own copy.

### 2. Clone Your Fork

```bash
# Clone your fork locally
git clone https://github.com/your-username/taiko-groups-map.git
cd taiko-groups-map

# Add upstream remote (original repository)
git remote add upstream https://github.com/Taiko-Community-Alliance/taiko-groups-map.git
```

### 3. Create a Feature Branch

```bash
# Always start from main
git checkout main

# Pull latest changes
git pull upstream main

# Create new branch for your feature/fix
git checkout -b feature/your-feature-name
# OR for bug fixes
git checkout -b fix/your-bug-fix
```

### 4. Make Your Changes

- Follow the existing code style and conventions
- Add comments for complex logic
- Keep changes focused and atomic (one feature/fix per PR)
- Test your changes thoroughly

### 5. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with a clear message
git commit -m "feat: add new group filter functionality"
# OR for bug fixes
git commit -m "fix: resolve map marker rendering issue"
```

**Commit Message Format:**
- Use imperative mood ("Add feature" not "Added feature")
- First line should be 50 characters or less
- Include relevant issue number if applicable: `fix: resolve issue #123`

### 6. Push to Your Fork

```bash
# Push your changes to your fork
git push origin feature/your-feature-name
```

### 7. Create a Pull Request

1. Go to your fork on GitHub: `https://github.com/your-username/taiko-groups-map`
2. Click "Compare & pull request" next to your branch
3. Fill out the PR template completely
4. Click "Create pull request"

## 📝 Pull Request Guidelines

### Before Submitting

- [ ] I have read the [Code of Conduct](CODE_OF_CONDUCT.md)
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
- [ ] Any dependent changes have been merged and published in downstream modules

### PR Template

Please use the provided PR template when creating pull requests. It includes:
- Related issue number
- Description of changes
- Testing performed
- Screenshots if applicable
- Checklist for review

### Review Process

1. **Automated Checks:** GitHub Actions will run tests and linting
2. **Initial Review:** Project maintainers will review your PR
3. **Changes Requested:** You may be asked to make changes
4. **Approved:** PR will be merged by a maintainer
5. **Merged:** Your contribution is now part of the project!

## 🐛 Reporting Bugs

### Before Reporting

- Check the [existing issues](https://github.com/Taiko-Community-Alliance/taiko-groups-map/issues) to see if the bug has already been reported
- Ensure the bug was not already fixed in the latest version

### How to Report

1. Go to [Issues](https://github.com/Taiko-Community-Alliance/taiko-groups-map/issues/new/choose)
2. Select **Bug Report** template
3. Fill out all sections completely
4. Include:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos
   - Browser and device information
   - Any error messages

**Example Bug Report:**

```markdown
**Description:** Map markers not displaying on mobile devices

**Steps to Reproduce:**
1. Open https://taiko-community-alliance.github.io/taiko-groups-map/
2. Use mobile device (iOS Safari)
3. Observe that markers are missing

**Expected:** Markers should display on all devices
**Actual:** Markers only display on desktop

**Device:** iPhone 13, iOS 16.4
**Browser:** Safari Mobile
**Version:** 1.2.0
```

## ✨ Requesting Features

### Before Requesting

- Check [existing feature requests](https://github.com/Taiko-Community-Alliance/taiko-groups-map/issues?q=is%3Aissue+label%3A%22enhancement%22)
- Ensure the feature hasn't been requested before

### How to Request

1. Go to [Issues](https://github.com/Taiko-Community-Alliance/taiko-groups-map/issues/new/choose)
2. Select **Feature Request** template
3. Fill out all sections completely
4. Include:
   - Problem description
   - Proposed solution
   - Alternatives considered
   - Use case

**Example Feature Request:**

```markdown
**Problem:** Users want to filter groups by type (Community, Professional, School)

**Proposed Solution:** Add dropdown filter for group types

**Alternatives:** Could use checkboxes or search

**Use Case:** Helps users find relevant groups quickly
```

## 📚 Improving Documentation

Documentation improvements are always welcome! This includes:

- 📖 README updates
- 📝 Code comments
- 📊 API documentation
- 🎓 Setup guides
- 📋 Tutorials

### How to Improve Documentation

1. Fork the repository
2. Make your documentation changes
3. Submit a pull request with the **Documentation** template

## 💻 Code Style Guide

### JavaScript

- Use `const` and `let` instead of `var`
- Follow ES6+ syntax
- Use meaningful variable names
- Add JSDoc comments for functions
- Keep functions small and focused
- Use consistent indentation (2 spaces)

### HTML/CSS

- Use semantic HTML5
- Follow BEM naming convention for CSS
- Keep styles organized
- Use comments to separate sections

### Git

- Write clear commit messages
- Keep commits atomic
- Rebase instead of merge when possible
- Keep branches focused

## 🧪 Testing

### Running Tests

```bash
# Run build to verify no errors
npm run build

# Test on different browsers
npm run dev
```

### Manual Testing Checklist

Before submitting a PR, test:

- [ ] Map loads correctly
- [ ] All group markers display
- [ ] Filter functionality works
- [ ] Responsive design on mobile
- [ ] Data loads from CSV
- [ ] No console errors
- [ ] Build completes without warnings

## 📊 Metrics for Good Contributions

| Metric | Good | Excellent |
|--------|------|-----------|
| Lines of code | < 200 | < 100 |
| Files changed | < 5 | < 3 |
| Commit messages | Clear | Clear + references issues |
| PR description | Complete | Complete + screenshots |
| Tests | Manual testing | Manual + automated |
| Documentation | Updated | Updated + examples |

## 🎯 Good First Issues

Looking for a way to contribute? Check out these beginner-friendly issues:

- [Good First Issue](https://github.com/Taiko-Community-Alliance/taiko-groups-map/labels/good%20first%20issue)
- [Help Wanted](https://github.com/Taiko-Community-Alliance/taiko-groups-map/labels/help%20wanted)

## 🏆 Recognition

All meaningful contributions will be recognized:

- **Code contributors** will be listed in the README
- **Issue reporters** will be thanked in release notes
- **Regular contributors** may be invited to join the maintainer team

## 📞 Getting Help

If you have questions or need help:

- Open a [Discussion](https://github.com/Taiko-Community-Alliance/taiko-groups-map/discussions)
- Ask in our [Taiko Community Discord](https://discord.gg/taiko)
- Check our [Wiki](https://github.com/Taiko-Community-Alliance/taiko-groups-map/wiki)

## 📜 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

🎉 **Thank you for contributing to Taiko Groups Map!**

*Your contributions help make this project better for the entire Taiko community.*