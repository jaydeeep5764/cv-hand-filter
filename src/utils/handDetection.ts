import { Hands, Results } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

export interface HandLandmarks {
  x: number;
  y: number;
  z: number;
}

export interface HandDetectionResult {
  leftHand: HandLandmarks[] | null;
  rightHand: HandLandmarks[] | null;
  timestamp: number;
}

let hands: Hands;
let camera: Camera;

export async function initializeHandDetection(
  videoElement: HTMLVideoElement,
  onResults: (results: HandDetectionResult) => void
): Promise<void> {
  hands = new Hands({
    locateFile: (file: string) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    },
  });

  hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results: Results) => {
    const leftHand = results.multiHandedness?.[0]?.classification?.[0]?.label === 'Left'
      ? results.multiHandLandmarks?.[0]
      : results.multiHandedness?.[1]?.classification?.[0]?.label === 'Left'
      ? results.multiHandLandmarks?.[1]
      : null;

    const rightHand = results.multiHandedness?.[0]?.classification?.[0]?.label === 'Right'
      ? results.multiHandLandmarks?.[0]
      : results.multiHandedness?.[1]?.classification?.[0]?.label === 'Right'
      ? results.multiHandLandmarks?.[1]
      : null;

    onResults({
      leftHand: leftHand || null,
      rightHand: rightHand || null,
      timestamp: Date.now(),
    });
  });

  camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({ image: videoElement });
    },
    width: videoElement.videoWidth,
    height: videoElement.videoHeight,
  });

  camera.start();
}

export function stopHandDetection(): void {
  if (camera) {
    camera.stop();
  }
}

export function getHandPosition(landmarks: HandLandmarks[]): { x: number; y: number } {
  if (!landmarks || landmarks.length === 0) {
    return { x: 0, y: 0 };
  }

  // Use wrist landmark (index 0)
  const wrist = landmarks[0];
  return { x: wrist.x, y: wrist.y };
}

export function calculateDistance(
  pos1: { x: number; y: number },
  pos2: { x: number; y: number }
): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
