import { createFileRoute } from "@tanstack/react-router";
import { WorldShell } from "@/components/village/WorldShell";
import { ChatRoom } from "@/components/village/ChatRoom";

export const Route = createFileRoute("/friendbot")({
  head: () => ({
    meta: [
      { title: "FriendBot — Your Mental Health Village" },
      {
        name: "description",
        content: "FriendBot is a warm companion who listens without judgement. Vent, ramble or just say hello.",
      },
      { property: "og:title", content: "FriendBot — Your Mental Health Village" },
      { property: "og:description", content: "A warm companion who listens without judgement." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FriendBotWorld,
});

function FriendBotWorld() {
  return (
    <WorldShell
      title="FriendBot's Garden House"
      subtitle="Blossoms at the window, tea on the table. No advice unless you ask — just company."
      accent="rose"
    >
      <ChatRoom
        placeholder="Say anything — I'm here."
        note="This is the chat space for FriendBot — the world around it is still being built."
        seed={[
          {
            id: "f1",
            role: "them",
            author: "FriendBot",
            text: "Hey, you made it. How has your day been treating you?",
          },
        ]}
      />
    </WorldShell>
  );
}
