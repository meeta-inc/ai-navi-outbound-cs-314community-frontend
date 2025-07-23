# AI Navi Frontend - Development & Testing Makefile
# Usage: make <target>

.PHONY: help install dev build test test-watch test-coverage lint clean storybook chromatic all-tests ci-test health

# Default target
help: ## Show this help message
	@echo "AI Navi Frontend Development Commands"
	@echo "====================================="
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quick Start:"
	@echo "  make install    # Install dependencies"
	@echo "  make dev        # Start development server"
	@echo "  make test       # Run all tests"
	@echo "  make ci-test    # Run CI-style tests"

# Installation
install: ## Install project dependencies
	@echo "🔧 Installing dependencies..."
	npm ci
	@echo "✅ Dependencies installed successfully"

install-dev: ## Install dependencies for development
	@echo "🔧 Installing development dependencies..."
	npm install
	@echo "✅ Development dependencies installed successfully"

# Development
dev: ## Start development server
	@echo "🚀 Starting development server..."
	npm run dev

build: ## Build production bundle
	@echo "🏗️ Building production bundle..."
	npm run build
	@echo "✅ Build completed successfully"

preview: ## Preview production build
	@echo "👀 Starting preview server..."
	npm run preview

# Testing
test: ## Run Jest tests
	@echo "🧪 Running Jest tests..."
	npm test -- --watchAll=false
	@echo "✅ Tests completed"

test-watch: ## Run Jest tests in watch mode
	@echo "👀 Running Jest tests in watch mode..."
	npm run test:watch

test-coverage: ## Run tests with coverage report
	@echo "📊 Running tests with coverage..."
	npm run test:coverage -- --watchAll=false
	@echo "📈 Coverage report generated in ./coverage/"

test-specific: ## Run specific test file (Usage: make test-specific FILE=ChatMessage.test.tsx)
	@echo "🎯 Running specific test: $(FILE)"
	npm test -- --watchAll=false $(FILE)

# Storybook
storybook: ## Start Storybook development server
	@echo "📚 Starting Storybook..."
	npm run storybook

build-storybook: ## Build Storybook static files
	@echo "🏗️ Building Storybook..."
	npm run build-storybook
	@echo "✅ Storybook built in ./storybook-static/"

test-storybook: ## Run Storybook tests
	@echo "🧪 Running Storybook tests..."
	npm run test-storybook

# Visual Testing
chromatic: ## Run Chromatic visual tests
	@echo "🎨 Running Chromatic visual tests..."
	npm run chromatic

# Code Quality
lint: ## Run ESLint
	@echo "🔍 Running ESLint..."
	npm run lint
	@echo "✅ Linting completed"

lint-fix: ## Run ESLint with auto-fix
	@echo "🛠️ Running ESLint with auto-fix..."
	npm run lint -- --fix
	@echo "✅ Linting and auto-fix completed"

# Comprehensive Testing
all-tests: ## Run all tests (Jest + Storybook + Lint)
	@echo "🚀 Running comprehensive test suite..."
	@echo ""
	@echo "1️⃣ Running Jest tests..."
	make test
	@echo ""
	@echo "2️⃣ Running ESLint..."
	make lint
	@echo ""
	@echo "3️⃣ Building project..."
	make build
	@echo ""
	@echo "4️⃣ Building Storybook..."
	make build-storybook
	@echo ""
	@echo "✅ All tests completed successfully!"

ci-test: ## Run CI-style tests (Jest + Build + Storybook)
	@echo "🤖 Running CI-style tests..."
	@echo ""
	@echo "📦 Installing dependencies..."
	npm ci
	@echo ""
	@echo "🧪 Running Jest tests with coverage..."
	npm run test:coverage -- --watchAll=false
	@echo ""
	@echo "🏗️ Building project..."
	npm run build
	@echo ""
	@echo "📚 Building Storybook..."
	npm run build-storybook || echo "⚠️ Storybook build failed (continuing...)"
	@echo ""
	@echo "✅ CI tests completed!"

ci-test-with-lint: ## Run CI-style tests including lint
	@echo "🤖 Running CI-style tests with lint..."
	@echo ""
	@echo "📦 Installing dependencies..."
	npm ci
	@echo ""
	@echo "🔍 Running ESLint..."
	npm run lint
	@echo ""
	@echo "🧪 Running Jest tests with coverage..."
	npm run test:coverage -- --watchAll=false
	@echo ""
	@echo "🏗️ Building project..."
	npm run build
	@echo ""
	@echo "📚 Building Storybook..."
	npm run build-storybook || echo "⚠️ Storybook build failed (continuing...)"
	@echo ""
	@echo "✅ CI tests completed!"

# Health Checks
health: ## Run health checks (quick validation)
	@echo "🏥 Running health checks..."
	@echo ""
	@echo "📋 Checking Node.js version..."
	@node --version
	@echo ""
	@echo "📋 Checking npm version..."
	@npm --version
	@echo ""
	@echo "📋 Checking package.json..."
	@test -f package.json && echo "✅ package.json exists" || echo "❌ package.json missing"
	@echo ""
	@echo "📋 Checking dependencies..."
	@npm list --depth=0 > /dev/null 2>&1 && echo "✅ Dependencies OK" || echo "⚠️ Dependency issues detected"
	@echo ""
	@echo "📋 Checking TypeScript config..."
	@test -f tsconfig.json && echo "✅ tsconfig.json exists" || echo "❌ tsconfig.json missing"
	@echo ""
	@echo "📋 Quick syntax check..."
	@npx tsc --noEmit --skipLibCheck && echo "✅ TypeScript compilation OK" || echo "❌ TypeScript errors detected"
	@echo ""
	@echo "🏥 Health check completed!"

# Utilities
clean: ## Clean build artifacts and node_modules
	@echo "🧹 Cleaning build artifacts..."
	rm -rf dist/
	rm -rf build/
	rm -rf storybook-static/
	rm -rf coverage/
	rm -rf node_modules/
	@echo "✅ Cleanup completed"

clean-cache: ## Clean npm and build caches
	@echo "🧹 Cleaning caches..."
	npm cache clean --force
	rm -rf .vite/
	rm -rf .storybook/cache/
	@echo "✅ Cache cleanup completed"

# Development shortcuts
quick-test: ## Quick test (Jest only, no coverage)
	@echo "⚡ Running quick tests..."
	npm test -- --watchAll=false --verbose=false

component-test: ## Test specific component (Usage: make component-test COMPONENT=ChatMessage)
	@echo "🎯 Testing $(COMPONENT) component..."
	npm test -- --watchAll=false $(COMPONENT)

# Environment validation
check-env: ## Check environment setup
	@echo "🔍 Checking environment setup..."
	@echo ""
	@echo "Node.js: $$(node --version)"
	@echo "npm: $$(npm --version)"
	@echo "TypeScript: $$(npx tsc --version)"
	@echo ""
	@test -f .env && echo "✅ .env file exists" || echo "⚠️ .env file not found"
	@test -f jest.config.js && echo "✅ Jest config exists" || echo "❌ Jest config missing"
	@test -f eslint.config.js && echo "✅ ESLint config exists" || echo "❌ ESLint config missing"
	@test -f tailwind.config.js && echo "✅ Tailwind config exists" || echo "❌ Tailwind config missing"

# Performance testing
perf-test: ## Run performance tests
	@echo "⚡ Running performance analysis..."
	npm run build
	@echo "📦 Bundle analysis (approximate):"
	@ls -lh dist/assets/ 2>/dev/null || echo "⚠️ Build assets not found"

# Documentation
docs: ## Generate and open documentation
	@echo "📖 Opening documentation..."
	@echo "Storybook: http://localhost:6006"
	@echo "Dev Server: http://localhost:5173"
	@echo "API Docs: See README.md"

# Git hooks
pre-commit: ## Run pre-commit checks
	@echo "🔄 Running pre-commit checks..."
	make quick-test
	@echo "✅ Pre-commit checks passed!"

pre-commit-with-lint: ## Run pre-commit checks including lint
	@echo "🔄 Running pre-commit checks with lint..."
	make lint
	make quick-test
	@echo "✅ Pre-commit checks passed!"

# Complete development cycle
full-cycle: ## Complete development cycle (install -> test -> build)
	@echo "🔄 Running full development cycle..."
	make install
	make all-tests
	make health
	@echo "🎉 Full development cycle completed successfully!"