"""Input validation for Narad - prevent XSS, injection, abuse"""

import re
from typing import Optional, List
from datetime import datetime, timedelta

class InputValidator:
    """Validate all user inputs"""
    
    # Constants
    MAX_MESSAGE_LENGTH = 4096
    MAX_COMMAND_ARGS = 5
    MAX_RECALL_RESULTS = 50
    TELEGRAM_COMMAND_PATTERN = r'^/([a-z_]+)(\s.+)?$'
    
    @staticmethod
    def validate_telegram_command(message: str) -> tuple[Optional[str], Optional[str]]:
        """
        Validate Telegram command format
        Returns: (command, args) or (None, None) if invalid
        """
        if not message or len(message) > InputValidator.MAX_MESSAGE_LENGTH:
            return None, None
        
        match = re.match(InputValidator.TELEGRAM_COMMAND_PATTERN, message)
        if not match:
            return None, None
        
        command = match.group(1)
        args = match.group(2).strip() if match.group(2) else None
        
        # Whitelist of allowed commands
        allowed_commands = {
            'idea', 'recall', 'research', 'draft', 
            'status', 'nisha', 'digest', 'help'
        }
        
        if command not in allowed_commands:
            return None, None
        
        return command, args
    
    @staticmethod
    def validate_idea_text(text: str) -> bool:
        """Validate idea submission"""
        if not text or len(text) > InputValidator.MAX_MESSAGE_LENGTH:
            return False
        if len(text.strip()) < 5:  # Minimum meaningful idea
            return False
        return True
    
    @staticmethod
    def validate_search_query(query: str) -> bool:
        """Validate search query"""
        if not query or len(query) > 200:
            return False
        # Block common injection patterns
        dangerous_patterns = ['SELECT', 'DROP', 'DELETE', 'INSERT', ';', '--']
        if any(pattern in query.upper() for pattern in dangerous_patterns):
            return False
        return True
    
    @staticmethod
    def sanitize_html(text: str) -> str:
        """Remove HTML/script tags"""
        # Remove script tags
        text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.IGNORECASE | re.DOTALL)
        # Remove other potentially dangerous tags
        text = re.sub(r'<(iframe|embed|object|link)[^>]*>', '', text, flags=re.IGNORECASE)
        # Escape HTML entities
        text = text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        return text
    
    @staticmethod
    def validate_api_key(key: str, key_type: str) -> bool:
        """Validate API key format"""
        if not key or len(key) < 10:
            return False
        
        # Key type specific validation
        if key_type == 'groq' and not key.startswith('gsk_'):
            return False
        if key_type == 'openrouter' and not key.startswith('sk-or-'):
            return False
        if key_type == 'telegram' and not key.isalnum() or ':' not in key:
            return False
        
        return True

class RateLimiter:
    """Rate limiting per user/IP"""
    
    def __init__(self):
        self.requests = {}  # {key: [(timestamp, endpoint), ...]}
    
    def is_allowed(self, key: str, endpoint: str, limit: int, window: int) -> bool:
        """
        Check if request is allowed
        key: user ID or IP
        endpoint: API endpoint
        limit: max requests
        window: time window in seconds
        """
        now = datetime.now()
        request_key = f"{key}:{endpoint}"
        
        # Clean old requests
        if request_key in self.requests:
            self.requests[request_key] = [
                (ts, ep) for ts, ep in self.requests[request_key]
                if (now - ts).total_seconds() < window
            ]
        else:
            self.requests[request_key] = []
        
        # Check limit
        if len(self.requests[request_key]) >= limit:
            return False
        
        # Add this request
        self.requests[request_key].append((now, endpoint))
        return True
