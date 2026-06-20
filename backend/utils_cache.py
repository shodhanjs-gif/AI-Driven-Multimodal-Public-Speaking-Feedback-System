"""
Performance optimization utilities for caching and video processing.
"""
import hashlib
import json
import os
import time
import cv2
from functools import lru_cache

CACHE_DIR = "cache"


def ensure_cache_dir():
    """Ensure cache directory exists"""
    if not os.path.exists(CACHE_DIR):
        os.makedirs(CACHE_DIR)


def get_file_hash(file_path):
    """
    Generate SHA256 hash of a file for cache key.
    Only reads first 1MB for performance on large files.
    """
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        chunk = f.read(1024 * 1024)
        hasher.update(chunk)
    return hasher.hexdigest()


def get_cached_result(video_hash):
    """
    Retrieve cached analysis result if it exists.
    Returns None if cache miss.
    """
    ensure_cache_dir()
    cache_file = os.path.join(CACHE_DIR, f"{video_hash}.json")
    if os.path.exists(cache_file):
        try:
            with open(cache_file, 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"Cache read error: {e}")
            return None
    return None


def save_to_cache(video_hash, result_data):
    """Save analysis result to cache."""
    ensure_cache_dir()
    cache_file = os.path.join(CACHE_DIR, f"{video_hash}.json")
    try:
        with open(cache_file, 'w') as f:
            json.dump(result_data, f)
        print(f"✅ Result cached: {video_hash[:8]}...")
    except Exception as e:
        print(f"Cache write error: {e}")


def clear_old_cache(max_age_days=7):
    """Clear cache files older than max_age_days."""
    ensure_cache_dir()
    current_time = time.time()
    max_age_seconds = max_age_days * 24 * 60 * 60
    for filename in os.listdir(CACHE_DIR):
        file_path = os.path.join(CACHE_DIR, filename)
        if os.path.isfile(file_path):
            file_age = current_time - os.path.getmtime(file_path)
            if file_age > max_age_seconds:
                try:
                    os.remove(file_path)
                    print(f"🗑️ Removed old cache: {filename}")
                except Exception as e:
                    print(f"Error removing cache file: {e}")


@lru_cache(maxsize=128)
def get_video_metadata(video_path):
    """Cache video metadata to avoid repeated file operations."""
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    return {
        'fps': fps,
        'frame_count': frame_count,
        'width': width,
        'height': height,
        'duration': frame_count / fps if fps > 0 else 0
    }


def optimize_video_params(video_path):
    """
    Dynamically calculate optimal stride and max_frames based on video duration.
    Ensures the ENTIRE video is sampled, not just the beginning.
    """
    metadata = get_video_metadata(video_path)
    frame_count = metadata['frame_count']

    target_samples = 150
    if frame_count <= target_samples:
        stride = 1
    else:
        stride = int(frame_count / target_samples)
        stride = max(1, stride)

    max_frames = frame_count
    return stride, max_frames
