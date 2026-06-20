import cv2
import mediapipe as mp

mp_holistic = mp.solutions.holistic


def _is_good_posture(lm):
    left_sh = lm[11].y
    right_sh = lm[12].y
    left_hip = lm[23].y
    right_hip = lm[24].y
    # More forgiving thresholds for natural posture variation
    return abs(left_sh - right_sh) < 0.05 and abs(left_hip - right_hip) < 0.05


def _eye_contact(face_lm):
    # Using iris landmarks for more accurate eye contact detection
    left_iris = face_lm.landmark[468].x
    right_iris = face_lm.landmark[473].x
    left_y = face_lm.landmark[468].y
    right_y = face_lm.landmark[473].y
    return (0.25 < left_iris < 0.75 and 0.25 < right_iris < 0.75 and
            0.25 < left_y < 0.75 and 0.25 < right_y < 0.75)


def analyze_video(video_path, stride=5, max_frames=300):
    """
    Analyze video for posture, gestures, and eye contact.
    Optimized with dynamic frame sampling for better performance.

    Args:
        video_path: Path to video file
        stride: Process every Nth frame (higher = faster, default: 5)
        max_frames: Maximum frames to process (default: 300)
    """
    cap = cv2.VideoCapture(video_path)
    total = 0
    posture_good = 0
    gestures_detected = 0
    eye_contact_frames = 0

    gesture_positions = []
    movement_intensity = []
    posture_scores = []

    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    with mp_holistic.Holistic(
        static_image_mode=False,
        model_complexity=0,
        refine_face_landmarks=True
    ) as holistic:
        prev_hand_pos = None
        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if total % stride != 0:
                total += 1
                continue
            total += 1

            # Resize frame for speed
            height, width = frame.shape[:2]
            if width > 640:
                scale = 640 / width
                frame = cv2.resize(frame, (640, int(height * scale)))

            img = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            res = holistic.process(img)

            # Posture analysis
            if res.pose_landmarks:
                lm = res.pose_landmarks.landmark
                is_good = _is_good_posture(lm)
                if is_good:
                    posture_good += 1
                shoulder_diff = abs(lm[11].y - lm[12].y)
                hip_diff = abs(lm[23].y - lm[24].y)
                posture_score = max(0, min(100, 100 - (shoulder_diff + hip_diff) * 500))
                posture_scores.append(posture_score)

            # Gesture tracking
            if res.left_hand_landmarks or res.right_hand_landmarks:
                gestures_detected += 1
                if res.right_hand_landmarks:
                    wrist = res.right_hand_landmarks.landmark[0]
                    x = int(wrist.x * frame_width)
                    y = int(wrist.y * frame_height)
                    gesture_positions.append({"x": x, "y": y, "time": total})
                    if prev_hand_pos:
                        dx = x - prev_hand_pos[0]
                        dy = y - prev_hand_pos[1]
                        intensity = (dx ** 2 + dy ** 2) ** 0.5
                        movement_intensity.append(intensity)
                    prev_hand_pos = (x, y)

            # Eye contact
            if res.face_landmarks:
                if _eye_contact(res.face_landmarks):
                    eye_contact_frames += 1

    cap.release()

    used = total if total else 1
    posture_ratio = posture_good / used
    gesture_ratio = gestures_detected / used
    eye_ratio = eye_contact_frames / used

    avg_posture_score = round(sum(posture_scores) / len(posture_scores), 1) if posture_scores else 0
    avg_movement = round(sum(movement_intensity) / len(movement_intensity), 2) if movement_intensity else 0

    # Gesture heatmap (10x10 grid)
    heatmap_grid = [[0 for _ in range(10)] for _ in range(10)]
    for pos in gesture_positions:
        grid_x = min(9, pos["x"] // (frame_width // 10))
        grid_y = min(9, pos["y"] // (frame_height // 10))
        heatmap_grid[grid_y][grid_x] += 1

    # Confidence index
    confidence_index = round(
        (posture_ratio * 0.35 +
         eye_ratio * 0.40 +
         min(gesture_ratio * 2, 1) * 0.25) * 100,
        1
    )

    return {
        "posture": {
            "ratio": round(posture_ratio, 2),
            "score": avg_posture_score,
            "label": "excellent" if posture_ratio > 0.8 else "good" if posture_ratio > 0.6 else "average" if posture_ratio > 0.4 else "poor"
        },
        "gestures": {
            "ratio": round(gesture_ratio, 2),
            "total_movements": len(gesture_positions),
            "avg_intensity": avg_movement,
            "level": "low" if gesture_ratio < 0.15 else "balanced" if gesture_ratio < 0.4 else "excessive",
            "heatmap": heatmap_grid
        },
        "eye_contact": {
            "ratio": round(eye_ratio, 2),
            "percentage": round(eye_ratio * 100, 1),
            "level": "excellent" if eye_ratio > 0.7 else "moderate" if eye_ratio > 0.4 else "low"
        },
        "confidence_index": confidence_index
    }
