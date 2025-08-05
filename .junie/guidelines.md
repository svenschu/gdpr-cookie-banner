# Project Guidelines

## Project Overview
This is a TypeScript/Lit web component project for a GDPR cookie banner following open-wc recommendations.

## Technology Stack & Tools
- **Language**: TypeScript 5.5+
- **Framework**: Lit 3.1+ for web components
- **Testing**: Web Test Runner with @open-wc/testing
- **Build**: TypeScript compiler (tsc)
- **Package Manager**: npm
- **Module System**: ES modules

## Project Structure
```
src/                    # Source TypeScript files
test/                   # Test files (.test.ts)
dist/                   # Compiled JavaScript output
requirements/           # Project requirements and epics
prompts/               # Development prompts and guidelines
demo/                  # Demo files
```

## Development Process - Test-Driven Development (TDD)

### Strict TDD Workflow
1. **Red**: Write a failing test that fully captures the desired behavior, including edge cases
2. **Green**: Implement only the minimal code to pass **all** current tests
3. **Refactor**: Immediately refactor for clarity, maintainability, and performance while maintaining 100% green tests
4. **Coverage**: Maintain overall test coverage ≥ 95%

### Testing Requirements
- **Always run tests** to verify correctness of proposed solutions
- **Test command**: `npm test` (runs TypeScript compilation + Web Test Runner with coverage)
- **Watch mode**: `npm run test:watch` for development
- Tests must be written in TypeScript using @open-wc/testing framework
- All tests should pass before submitting changes

## Code Style & Quality

### TypeScript Standards
- Follow TypeScript best practices and strict type checking
- Use modern ES module syntax
- Favor simple, readable solutions over premature optimization
- Remove unnecessary abstractions, layers, or configuration
- Handle errors explicitly with proper error types

### Documentation
- Add comments only when intent is not obvious from code
- Keep comments concise and high-signal
- Update README.md when adding new features or changing behavior

### Web Components Best Practices
- Follow Lit component lifecycle patterns
- Use proper property/attribute declarations
- Implement accessibility features (ARIA, keyboard navigation)
- Ensure responsive design principles

## Build & Deployment
- **Build command**: `npm run build` (compiles TypeScript + analyzes custom elements)
- **Always build** the project before submitting results
- Ensure `dist/` directory is properly generated
- Custom elements manifest should be updated via `npm run analyze`

## Requirements Engineering
When working with requirements:
- Structure work using Goals → Epics → User Stories → Tasks/Acceptance Criteria
- Use "Given/When/Then" format for acceptance criteria
- Prioritize using WSJF (Weighted Shortest Job First) when applicable
- Mark status as: Planned, In-Progress, Blocked, Done
- Capture non-functional requirements (security, performance, accessibility)

## Output Format
- Present code changes clearly with tests first, then implementation
- Include build verification steps
- Ensure all tests pass and coverage requirements are met
- Update documentation when necessary

## Workflow Summary
1. Understand requirements and write failing tests
2. Implement minimal code to pass tests
3. Refactor while maintaining green tests
4. Run `npm test` to verify all tests pass
5. Run `npm run build` to ensure project builds successfully
6. Update documentation if needed
7. Submit changes with verification that tests pass and project builds
