import { createFileRoute } from "@tanstack/react-router";
import { WorldShell } from "@/components/village/WorldShell";
import { ChatRoom } from "@/components/village/ChatRoom";

export const Route = createFileRoute("/guidebot")({
  head: () => ({
    meta: [
      { title: "GuideBot — Your Mental Health Village" },
      {
        name: "description",
        content: "Talk to GuideBot for grounding steps, coping ideas and gentle guidance whenever you need it.",
      },
      { property: "og:title", content: "GuideBot — Your Mental Health Village" },
      { property: "og:description", content: "Grounding steps and gentle guidance, one message at a time." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideBotWorld,
});

function GuideBotWorld() {
  return (
    <WorldShell
      title="GuideBot's Cottage"
      subtitle="A quiet room on the cliff where you can ask anything and get calm, practical guidance."
      accent="mint"
    >
      <ChatRoom
        placeholder="What's weighing on you today?"
        note="This is the chat space for GuideBot — the world around it is still being built."
        seed={[
          {
            id: "g1",
            role: "them",
            author: "GuideBot",
            text: "Hi, I'm GuideBot. Tell me what's on your mind and we'll take it one small step at a time.",
          },
        ]}
      />
    </WorldShell>
  );
}
