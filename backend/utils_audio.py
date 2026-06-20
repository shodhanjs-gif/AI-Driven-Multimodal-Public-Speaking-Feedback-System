import re
import librosa
import numpy as np
import whisper

# Load Whisper model once on startup for fast inference
print("🚀 Loading Whisper model on startup...")
whisper_model = whisper.load_model("tiny")
print("✅ Whisper model loaded and ready!")


def get_whisper_model():
    """Return the pre-loaded Whisper model"""
    return whisper_model


def transcribe_audio(audio_path: str) -> str:
    """Transcribe audio using OpenAI Whisper for high accuracy."""
    try:
        model = get_whisper_model()
        result = model.transcribe(audio_path, language="en", fp16=False)
        return result["text"].strip()
    except Exception as e:
        print(f"Transcription error: {e}")
        return ""


def detect_filler_words(transcript: str) -> dict:
    """
    Detect and count filler words in the transcript.
    Enhanced with context checks to distinguish valid usage from fillers.
    """
    filler_words = {
        "um": 0, "uh": 0, "like": 0, "you know": 0,
        "so": 0, "actually": 0, "basically": 0, "literally": 0,
        "kind of": 0, "sort of": 0, "i mean": 0, "right": 0
    }
    transcript_lower = transcript.lower()
    total_filler_count = 0

    # Count multi-word fillers first
    for filler in ["you know", "kind of", "sort of", "i mean"]:
        pattern = r'\b' + re.escape(filler) + r'\b'
        matches = re.findall(pattern, transcript_lower)
        count = len(matches)
        filler_words[filler] = count
        total_filler_count += count

    # Count single-word fillers with context awareness
    words = transcript_lower.split()
    for i, word in enumerate(words):
        clean_word = word.strip(".,!?;:\"'")

        if clean_word in ["um", "uh"]:
            filler_words[clean_word] += 1
            total_filler_count += 1
        elif clean_word == "like":
            is_verb_context = False
            is_comparison = False
            if i > 0:
                prev_word = words[i - 1].strip(".,!?;:\"'")
                if prev_word in ["i", "you", "we", "they", "he", "she", "it", "would", "might", "will", "did", "do"]:
                    is_verb_context = True
                if prev_word in ["looks", "seems", "sounds", "feels", "tastes", "smells", "acted"]:
                    is_comparison = True
            if i < len(words) - 1:
                next_word = words[i + 1].strip(".,!?;:\"'")
                if next_word == "to":
                    is_verb_context = True
            if not is_verb_context and not is_comparison:
                filler_words["like"] += 1
                total_filler_count += 1
        elif clean_word in ["so", "actually", "basically", "literally", "right"]:
            filler_words[clean_word] += 1
            total_filler_count += 1

    total_words = len(words)
    percentage = round((total_filler_count / total_words * 100), 2) if total_words > 0 else 0

    return {
        "total_count": total_filler_count,
        "percentage": percentage,
        "breakdown": {k: v for k, v in filler_words.items() if v > 0},
        "total_words": total_words
    }


def chunk_speaking_speed(y, sr_rate, chunk_size=2.0):
    """Break speech into 2-second chunks for plotting speaking speed."""
    chunk_samples = int(chunk_size * sr_rate)
    speeds = []
    for i in range(0, len(y), chunk_samples):
        chunk = y[i:i + chunk_samples]
        if len(chunk) < chunk_samples * 0.4:
            continue
        rms = float(np.mean(librosa.feature.rms(y=chunk)))
        peak = float(np.max(np.abs(chunk)))
        speeds.append({
            "time_sec": round(i / sr_rate, 2),
            "rms": rms,
            "peak": peak
        })
    return speeds


def analyze_speaking_speed(transcript: str, duration_sec: float) -> dict:
    words = transcript.split()
    count = len(words)
    if duration_sec == 0:
        wpm = 0
    else:
        wpm = (count / duration_sec) * 60

    if wpm == 0:
        level = "no speech"
    elif wpm < 80:
        level = "very slow"
    elif wpm < 110:
        level = "slow"
    elif wpm <= 160:
        level = "normal"
    elif wpm <= 180:
        level = "fast"
    else:
        level = "very fast"

    return {
        "word_count": count,
        "duration_sec": duration_sec,
        "wpm": round(wpm, 2),
        "level": level
    }


def analyze_audio_file(audio_path: str) -> dict:
    y, sr_rate = librosa.load(audio_path, sr=None)
    duration = float(librosa.get_duration(y=y, sr=sr_rate))
    rms = float(np.mean(librosa.feature.rms(y=y)))
    peak = float(np.max(np.abs(y)))

    transcript = transcribe_audio(audio_path)
    speaking_speed = analyze_speaking_speed(transcript, duration)
    filler_words = detect_filler_words(transcript)
    speed_chunks = chunk_speaking_speed(y, sr_rate)

    return {
        "transcript": transcript,
        "volume": {"rms": rms, "peak": peak},
        "speaking_speed": speaking_speed,
        "speed_chart": speed_chunks,
        "filler_words": filler_words
    }
