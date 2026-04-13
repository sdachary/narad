# Narad AI Go Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate narad AI service from JavaScript to Go for Cloudflare Workers WASM, adding retry logic with exponential backoff and concurrent provider requests

**Architecture:** Convert AI service to Go using Hono Go (https://hono.dev/go/0.3), compile to WASM for Cloudflare Workers. Maintain multi-provider routing with parallel health checks and concurrent fallback requests.

**Tech Stack:** Go 1.22+, Hono Go, Cloudflare Workers WASM, Go goroutines for concurrent requests

---

## Task 1: Setup Go Project Structure

**Files:**
- Create: `/home/deepak/Work/narad-go/ai/go.mod`
- Create: `/home/deepak/Work/narad-go/ai/main.go`
- Create: `/home/deepak/Work/narad-go/ai/go.mod`

- [ ] **Step 1: Initialize Go module**

Create directory and go.mod:
```bash
mkdir -p /home/deepak/Work/narad-go/ai
cd /home/deepak/Work/narad-go/ai
go mod init github.com/sdachary/narad-go/ai
```

- [ ] **Step 2: Create basic main.go with Hono Go**

```go
package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"
)

type Env struct {
	GROQ_API_KEY      string
	ANTHROPIC_API_KEY string
	OPENAI_API_KEY   string
	OPENROUTER_API_KEY string
	GEMINI_API_KEY   string
}

func main() {
	port := os.GetEnv("PORT", "8080")
	fmt.Printf("Starting Narad AI Go on port %s\n", port)
	http.ListenAndServe(":"+port, nil)
}
```

- [ ] **Step 3: Test build**

Run: `GOOS=wasip1 GOARCH=wasm go build -o ai.wasm .`
Expected: Binary builds successfully

- [ ] **Step 4: Commit**

---

## Task 2: Implement AI Provider Types

**Files:**
- Create: `/home/deepak/Work/narad-go/ai/providers/types.go`
- Create: `/home/deepak/Work/narad-go/ai/providers/config.go`

- [ ] **Step 1: Define provider types**

```go
// providers/types.go
package providers

type AIClient struct {
	Name       string
	Endpoint  string
	APIKey    string
	Models    Models
	Features  Features
}

type Models struct {
	Fast     string
	Balanced string
	Strong   string
}

type Features struct {
	Vision       bool
	FunctionCalls bool
	JSON         bool
	Streaming    bool
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type AIRequest struct {
	Model       string    `json:"model"`
	Messages    []Message `json:"messages"`
	MaxTokens   int       `json:"max_tokens,omitempty"`
	Temperature float64  `json:"temperature,omitempty"`
}

type AIResponse struct {
	Reply string `json:"reply"`
	Usage Usage  `json:"usage"`
}

type Usage struct {
	TotalTokens int `json:"total_tokens"`
}
```

- [ ] **Step 2: Define provider configuration**

```go
// providers/config.go
package providers

import "os"

var Providers = map[string]AIClient{
	"Groq": {
		Name:      "Groq",
		Endpoint: "https://api.groq.com/openai/v1/chat/completions",
		APIKey:   os.Getenv("GROQ_API_KEY"),
		Models: Models{
			Fast:     "llama-3.1-8b-instant",
			Balanced: "llama-3.3-70b-versatile",
			Strong:  "llama-3.2-90b-preview",
		},
		Features: Features{
			FunctionCalls: true,
			JSON:         true,
			Streaming:    true,
		},
	},
	// Add other providers
}
```

- [ ] **Step 3: Commit**

---

## Task 3: Implement Retry Logic with Backoff

**Files:**
- Create: `/home/deepak/Work/narad-go/ai/retry.go`

- [ ] **Step 1: Implement retry function**

```go
package main

import (
	"context"
	"errors"
	"net/http"
	"time"
)

type RetryableError struct {
	Message string
	Status  int
}

func (e *RetryableError) Error() string { return e.Message }

func isRetryable(resp *http.Response) bool {
	return resp.StatusCode == 429 || 
		   resp.StatusCode >= 500 && resp.StatusCode <= 504
}

func retryWithBackoff[T any](
	fn func() (T, error),
	maxRetries int,
	initialDelay time.Duration,
) (T, error) {
	var lastErr error
	for attempt := 0; attempt <= maxRetries; attempt++ {
		result, err := fn()
		if err == nil {
			return result, nil
		}
		lastErr = err
		// Check if retryable
		var retryErr *RetryableError
		if errors.As(err, &retryErr) && attempt < maxRetries {
			delay := initialDelay * time.DurationPow(2, attempt)
			time.Sleep(delay)
			continue
		}
		return *new(T), err
	}
	return *new(T), lastErr
}
```

- [ ] **Step 2: Test retry logic**

```go
func TestRetryWithBackoff() {
	callCount := 0
	fn := func() (int, error) {
		callCount++
		if callCount < 3 {
			return 0, &RetryableError{"retry", 429}
		}
		return callCount, nil
	}
	
	result, err := retryWithBackoff(fn, 3, 100*time.Millisecond)
	// result should be 3, err should be nil
}
```

- [ ] **Step 3: Commit**

---

## Task 4: Implement Multi-Provider Routing

**Files:**
- Create: `/home/deepak/Work/narad-go/ai/router.go`

- [ ] **Step 1: Implement provider selection**

```go
package main

import (
	"context"
	"sync"
	"time"
)

type Router struct {
	providers []Provider
}

type Provider interface {
	Name() string
	健康(context.Context, time.Duration) bool
	Call(context.Context, AIRequest) (AIResponse, error)
}

func NewRouter(providers ...Provider) *Router {
	return &Router{providers: providers}
}

// ClassifyTask determines task type from message keywords
func (r *Router) ClassifyTask(message string) string {
	keywords := map[string][]string{
		"debugging": {"debug", "error", "fix", "bug", "issue"},
		"writing":   {"write", "create", "draft", "compose"},
		"analysis":  {"analyze", "explain", "review", "compare"},
	}
	
	lower := toLower(message)
	for taskType, words := range keywords {
		for _, word := range words {
			if contains(lower, word) {
				return taskType
			}
		}
	}
	return "simple"
}

// SelectProvider returns provider based on task type
func (r *Router) SelectProvider(taskType string, available []string) string {
	routing := map[string]string{
		"debugging": "Anthropic",
		"writing":  "OpenAI",
		"analysis": "Gemini",
		"simple":   "Groq",
	}
	
	if provider, ok := routing[taskType]; ok {
		for _, avail := range available {
			if avail == provider {
				return provider
			}
		}
	}
	return available[0]
}
```

- [ ] **Step 2: Add concurrent fallback**

```go
// ConcurrentCall tries multiple providers in parallel, returns first success
func (r *Router) ConcurrentCall(ctx context.Context, req AIRequest, providers []string) (AIResponse, error) {
	type result struct {
		provider string
		response AIResponse
		err      error
	}
	
	resultCh := make(chan result, len(providers))
	var wg sync.WaitGroup
	
	for _, providerName := range providers {
		wg.Add(1)
		go func(name string) {
			defer wg.Done()
			resp, err := r.CallProvider(ctx, name, req)
			resultCh <- result{name, resp, err}
		}(providerName)
	}
	
	go func() {
		wg.Wait()
		close(resultCh)
	}()
	
	// Return first successful
	for res := range resultCh {
		if res.err == nil {
			return res.response, nil
		}
	}
	
	return AIResponse{}, errors.New("all providers failed")
}
```

- [ ] **Step 3: Commit**

---

## Task 5: Integration Test

**Files:**
- Create: `/home/deepak/Work/narad-go/ai/main_test.go`

- [ ] **Step 1: Write integration test**

```go
package main

import (
	"context"
	"testing"
	"time"
)

func TestFullAIFlow(t *testing.T) {
	ctx := context.Background()
	env := Env{
		GROQ_API_KEY: os.Getenv("GROQ_API_KEY"),
	}
	
	router := NewRouter(
		NewGroqClient(env.GROQ_API_KEY),
	)
	
	messages := []Message{
		{Role: "user", Content: "Hello, write a short poem"},
	}
	
	req := AIRequest{
		Model:       "llama-3.1-8b-instant",
		Messages:    messages,
		MaxTokens:   256,
		Temperature: 0.7,
	}
	
	resp, err := router.Call(ctx, "Groq", req)
	if err != nil {
		t.Fatalf("AI call failed: %v", err)
	}
	
	if resp.Reply == "" {
		t.Fatal("Empty response from AI")
	}
	
	t.Logf("Response: %s", resp.Reply)
}
```

- [ ] **Step 2: Run test**

Run: `go test -v -timeout 30s`
Expected: PASS

- [ ] **Step 3: Commit**

---

## Deployment

- [ ] **Step 1: Build WASM**

Build for Cloudflare Workers WASI:

```bash
GOOS=wasip1 GOARCH=wasm go build -o ai.wasm .
```

**Note:** After build, commit and push to trigger Cloudflare auto-deployment.

- [ ] **Step 2: Commit and push to trigger deployment**

The repo is connected to Cloudflare - push will auto-deploy.

```bash
git add .
git commit -m "feat: add Go AI service for Cloudflare Workers"
git push
```

- [ ] **Step 3: Final commit**