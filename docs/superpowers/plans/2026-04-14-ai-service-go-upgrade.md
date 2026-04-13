# Narad AI Service Go Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade narad AI service from JavaScript to Go while preserving existing functionality and improving performance

**Architecture:** Keep existing file structure but rewrite ai.js in Go, maintaining the same API interface and behavior

**Tech Stack:** Go 1.22+ (targeting WebAssembly for Cloudflare Workers), preserving existing JavaScript interface

---

## Task 1: Analyze Current AI Service

**Files:**
- Read: `/home/deepak/Work/narad/pages/services/ai.js`

- [ ] **Step 1: Document current functionality**
  - List all exported functions and their purposes
  - Identify dependencies on other services (config/providers.js, config/characters.js)
  - Note environment variables used
  - Document retry logic parameters (MAX_RETRIES=3, INITIAL_DELAY_MS=1000)

- [ ] **Step 2: Identify upgrade goals**
  - Preserve exact same function signatures and behavior
  - Improve performance through Go compilation
  - Maintain compatibility with existing JavaScript callers
  - Keep retry logic with exponential backoff

- [ ] **Step 3: Commit analysis**

## Task 2: Create Go Implementation Structure

**Files:**
- Create: `/home/deepak/Work/narad/pages/services/ai_go.go`
- Create: `/home/deepak/Work/narad/pages/services/ai_go_test.go`

- [ ] **Step 1: Set up Go file with package declaration**
  ```go
  package main
  
  // AI service implementation in Go
  ```

- [ ] **Step 2: Define exported functions matching JavaScript interface**
  - getAvailableProviders(env)
  - getProviderConfig(env, providerName)
  - classifyTask(message)
  - selectOptimalProvider(taskType, availableProviders)
  - selectProviderAndModel(agentType, message, availableProviders, character)
  - callAI(messages, providerConfig, options)

- [ ] **Step 3: Define supporting types and constants**
  - MAX_RETRIES, INITIAL_DELAY_MS
  - Provider configuration structures
  - Message, AIRequest, AIResponse types

- [ ] **Step 4: Commit structure**

## Task 3: Implement Core Functions

**Files:**
- Edit: `/home/deepak/Work/narad/pages/services/ai_go.go`

- [ ] **Step 1: Implement getAvailableProviders**
  - Filter PROVIDER_FALLBACK_ORDER based on env[provider.apiKey]
  - Return matching provider names

- [ ] **Step 2: Implement getProviderConfig**
  - Return provider config with API key from env
  - Handle null case when API key missing

- [ ] **Step 3: Implement classifyTask**
  - Convert message to lowercase
  - Check against PROVIDER_ROUTING.keywords mapping
  - Return task type or 'simple' default

- [ ] **Step 4: Implement selectOptimalProvider**
  - Try task-specific routing first
  - Fallback to default provider
  - Return first available as last resort

- [ ] **Step 5: Implement selectProviderAndModel**
  - Use agentType if provided, otherwise classify from message
  - Select model based on task type (debugging→strong, simple→fast, else balanced)
  - Get character info if provided
  - Return provider, model, and character

- [ ] **Step 6: Commit core functions**

## Task 4: Implement callAI with Retry Logic

**Files:**
- Edit: `/home/deepak/Work/narad/pages/services/ai_go.go`

- [ ] **Step 1: Implement retryWithBackoff helper function**
  - Generic retry with exponential backoff
  - Max retries: 3, initial delay: 1000ms
  - Retry on 429, 500-504, network, timeout errors
  - Delay calculation: initialDelay * 2^attempt

- [ ] **Step 2: Implement provider-specific request logic**
  - Anthropic: Add x-api-key and anthropic-version headers
  - Gemini: Construct endpoint with :generateContent?key=
  - OpenRouter: Add HTTP-Referer and X-Title headers
  - Others: Standard Authorization bearer token

- [ ] **Step 3: Process request/response for each provider type**
  - Handle character system prompt insertion
  - Convert between JavaScript and Go data structures
  - Parse provider-specific response formats

- [ ] **Step 4: Implement error handling**
  - Convert HTTP errors to Go errors with status and message
  - Handle empty responses from providers
  - Preserve original error behavior

- [ ] **Step 5: Commit AI call implementation**

## Task 5: Test and Verify Compatibility

**Files:**
- Edit: `/home/deepak/Work/narad/pages/services/ai_go_test.go`

- [ ] **Step 1: Write unit tests for each function**
  - Test getAvailableProviders with various env configs
  - Test getProviderConfig with valid/invalid API keys
  - Test classifyTask with sample messages for each task type
  - Test selectOptimalProvider with different availability scenarios
  - Test selectProviderAndModel with agentType and character variations
  - Test retryWithBackoff with success/failure scenarios

- [ ] **Step 2: Write integration tests**
  - Test full callAI flow with mocked HTTP responses
  - Verify behavior matches JavaScript implementation
  - Test error propagation and retry logic

- [ ] **Step 3: Run tests and fix issues**
  - Run: `go test ./...`
  - Address any test failures

- [ ] **Step 4: Commit test suite**

## Task 6: Update JavaScript to Use Go Implementation

**Files:**
- Edit: `/home/deepak/Work/narad/pages/services/ai.js`

- [ ] **Step 1: Replace implementation with Go wrapper**
  - Keep same function signatures and exports
  - Delegate to Go implementation via WebAssembly bridge
  - Or replace directly with Go-compiled version if build system supports it

- [ ] **Step 2: Ensure backward compatibility**
  - All existing imports and usages should work unchanged
  - No breaking changes to API

- [ ] **Step 3: Commit JavaScript update**

## Task 7: Build and Deploy

**Files:**
- None (build process)

- [ ] **Step 1: Build Go service for WebAssembly**
  ```bash
  GOOS=wasip1 GOARCH=wasm go build -o ai.wasm ./ai_go.go
  ```

- [ ] **Step 2: Verify build produces valid WASM**
  - Check file exists and is valid WASM binary
  - Confirm size is reasonable (<1MB typically)

- [ ] **Step 3: Commit build artifacts if needed**
  - Or configure build system to compile on deploy

- [ ] **Step 4: Final commit**

## Deployment Notes

Since this is an upgrade to an existing service:
1. The Go implementation should be drop-in compatible
2. All existing imports (`import { ... } from './ai.js'`) should continue to work
3. Environment variable requirements remain the same
4. Function signatures and return values must match exactly

## Rollback Plan

If issues occur after deployment:
1. Revert ai.js to original JavaScript implementation
2. Remove Go build artifacts
3. Redeploy previous version

## Files to Modify
- `/home/deepak/Work/narad/pages/services/ai.js` - Update to use Go implementation
- `/home/deepak/Work/narad/pages/services/ai_go.go` - New Go implementation
- `/home/deepak/Work/narad/pages/services/ai_go_test.go` - Tests for Go implementation
