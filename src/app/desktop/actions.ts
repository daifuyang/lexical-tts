"use server";

import { redirect } from "next/navigation";
import { createTtsWork } from "@/model/ttsWork";
import { now } from "@/lib/date";
import { getCurrentUser } from "@/lib/user";

export async function handleCreateWork() {
    const user = await getCurrentUser();
    if (!user) {
        return null;
    }
    const userId = user.userId;
    const work = await createTtsWork({
        title: "未命名作品",
        voiceName: "",
        editorState: "",
        content: "",
        audioUrl: "",
        duration: 0,
        status: 0, // 0 means draft
        creatorId: Number(userId),
        createdAt: now()
    });

    redirect(`/editor?id=${work.id}`);
}
