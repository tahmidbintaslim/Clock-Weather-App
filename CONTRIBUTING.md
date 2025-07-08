# Contributing to World Clock & Weather App

We welcome contributions to this project! Here's how you can help make it even better.

## Development Setup

1. **Fork the repository**

   ```bash
   git clone https://github.com/your-username/Clock-Weather-App.git
   cd Clock-Weather-App
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Add your OpenWeatherMap API key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the existing ESLint configuration
- **Naming**: Use descriptive variable and function names
- **Comments**: Add JSDoc comments for functions

### Component Guidelines

- **Functional Components**: Use React hooks
- **Props**: Define TypeScript interfaces for all props
- **State**: Use appropriate React hooks (useState, useEffect, etc.)
- **Accessibility**: Include ARIA labels and keyboard navigation

### CSS Guidelines

- **Tailwind CSS**: Use Tailwind utility classes
- **Custom CSS**: Only when Tailwind utilities aren't sufficient
- **Naming**: Use semantic class names
- **Responsive**: Mobile-first responsive design

## How to Contribute

### 1. Bug Reports

- Use the GitHub issue tracker
- Provide detailed reproduction steps
- Include screenshots if applicable
- Mention your browser and OS version

### 2. Feature Requests

- Check existing issues first
- Provide clear use case and benefit
- Consider implementation complexity
- Be open to discussion

### 3. Pull Requests

1. **Create a branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   - Follow the coding guidelines
   - Add tests if applicable
   - Update documentation

3. **Test your changes**

   ```bash
   npm run build
   npm run lint
   npm run preview
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

Use conventional commits format:

- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation changes
- `style:` for formatting changes
- `refactor:` for code refactoring
- `test:` for adding tests
- `chore:` for maintenance tasks

## Areas for Contribution

### Easy (Good for beginners)

- Add new cities to the world clock
- Improve documentation
- Fix minor styling issues
- Add new themes

### Medium

- Add new weather animations
- Improve error handling
- Add unit tests
- Optimize performance

### Hard

- Add weather forecasts
- Implement offline mode
- Add PWA features
- Add internationalization

## Code Review Process

1. **Automated checks**: ESLint and TypeScript checks must pass
2. **Manual review**: Code review by maintainers
3. **Testing**: Changes tested in multiple browsers
4. **Documentation**: README and docs updated if needed

## Questions?

- Create an issue for questions
- Join discussions in GitHub Discussions
- Check existing documentation first

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
