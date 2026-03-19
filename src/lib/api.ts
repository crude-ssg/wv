import { type GenSettings, type User, type VideoData } from "./api.types.gen";
import { lerp, randomUid } from "./utils";
import { http } from "./http-client";

const DUMMY_USER: User = {
    id: 1,
    username: "DEV_DUMMY",
    email: "example@email.com",
    premium: "1",
    tokens: 2450,
    created_at: "",
    updated_at: "",
    admin: 1
}

export async function getAuthenticatedUser(): Promise<User | null> {
    if (import.meta.env.PROD) {
        const user = await http<User>("/api/auth/").get();
        return user
    }

    return DUMMY_USER;
}

export function createDummyVideo(settings?: GenSettings): VideoData {
    return {
        id: randomUid(),
        filepath: '',
        job_id: randomUid(),
        job_status: 'pending',
        user_id: 1,
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        prompt: {
            aspectRatio: settings?.aspectRatio ?? '16:9',
            mode: settings?.mode ?? 'I2V',
            encodedImage: settings?.encodedImage ?? '',
            negativePrompt: settings?.negativePrompt ?? '',
            positivePrompt: settings?.positivePrompt ?? '',
            duration: settings?.duration ?? '10s',
        },
        timestamp: 'Just now',
        thumbnail: null,
    }
}

export async function generateVideo(options: GenSettings): Promise<VideoData> {
    if (import.meta.env.PROD) {
        const video = await http<VideoData>("/api/generate/").post(options);
        return video
    }

    return new Promise<VideoData>((resolve) => {
        setTimeout(() => {
            resolve(createDummyVideo(options))
        }, lerp(5000, 8000, Math.random()))
    });
}

export async function status(video_id: string): Promise<VideoData> {
    const video = await http<VideoData>(`/api/status?video_id=${video_id}`).get();
    return video;
}

export async function getHistory(): Promise<VideoData[]> {
    if (import.meta.env.PROD) {
        const videos = await http<VideoData[]>("/api/history/").get();
        return videos;
    }

    return [];
}
            