import { createFileRoute } from "@tanstack/react-router";
import { WorldShell } from "@/components/village/WorldShell";
import { ChatRoom } from "@/components/village/ChatRoom";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect — Ananda" },
      {
        name: "description",
        content: "The lantern-lit pagoda where villagers gather to talk, share small wins and cheer each other on.",
      },
      { property: "og:title", content: "Connect — Ananda" },
      { property: "og:description", content: "Gather in the pagoda and share your day with the village." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConnectWorld,
});

function ConnectWorld() {
  return (
    <WorldShell
      title="The Connect Pagoda"
      subtitle="Lanterns strung between the pillars, voices drifting over the cliff. Say hi to the village."
      accent="gold"
    >
      <ChatRoom
        placeholder="Share something with the village…"
        note="This is the group chat space for Connect — real villagers and rooms come next."
        seed={[
          { id: "c1", role: "them", author: "Mira", text: "Made it out for a walk today. Small win, but it counts." },
          { id: "c2", role: "them", author: "Ollie", text: "That's a big win, Mira 🌿 The river path is lovely at dusk." },
          { id: "c3", role: "them", author: "Village Keeper", text: "Welcome! Introduce yourself whenever you're ready." },
        ]}
      />
    </WorldShell>
  );
}
