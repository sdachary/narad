"""Structured logging for Narad"""

import logging
import json
import sys
from datetime import datetime
from logging.handlers import RotatingFileHandler

class JSONFormatter(logging.Formatter):
    """Format logs as JSON for easy parsing"""
    
    def format(self, record):
        log_data = {
            'timestamp': datetime.utcnow().isoformat(),
            'level': record.levelname,
            'logger': record.name,
            'message': record.getMessage(),
            'module': record.module,
            'function': record.funcName,
            'line': record.lineno,
        }
        
        # Add exception info if present
        if record.exc_info:
            log_data['exception'] = self.formatException(record.exc_info)
        
        # Add custom fields
        if hasattr(record, 'user_id'):
            log_data['user_id'] = record.user_id
        if hasattr(record, 'command'):
            log_data['command'] = record.command
        if hasattr(record, 'duration_ms'):
            log_data['duration_ms'] = record.duration_ms
        
        return json.dumps(log_data)

def setup_logging(log_file: str, log_level: str = 'INFO'):
    """Set up structured logging"""
    
    # Root logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level))
    
    # JSON handler (file)
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(JSONFormatter())
    logger.addHandler(file_handler)
    
    # Text handler (console)
    console_handler = logging.StreamHandler(sys.stdout)
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    return logger
