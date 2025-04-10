"use server";

import { redirect } from "next/navigation";
import { createTtsWork } from "@/model/ttsWork";
import { now } from "@/lib/date";
import { getCurrentUser } from "@/lib/user";

export async function createDraftWork() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    const userId = user.userId;
    const work = await createTtsWork({
        title: "未命名作品",
        voiceName: "",
        editorState: "",
        ssml: "",
        audioUrl: "",
        duration: 0,
        status: 0, // 0 means draft
        creatorId: Number(userId),
        createdAt: now()
    });

    return work.id;
}

export async function handleCreateWork() {
    const workId = await createDraftWork();
    redirect(`/editor?id=${workId}`);
}
