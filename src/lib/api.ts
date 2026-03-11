import { type GenSettings, type User, type VideoData } from "./api.types.gen";
import { lerp, randomInt } from "./utils";
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

export function createDummyVideo(settings: GenSettings): VideoData {
    return {
        id: randomInt(100000, 500000),
        url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
        prompt: settings.prompt,
        timestamp: 'Just now',
        thumbnail: null,
    }
}

/**
 * @param options Generation settings
 * @returns Generated video
 * 
 * @throws Error if generation failed, use error.message for user friendly message and error.cause for a error cause
 */
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