import type { Meta, StoryObj } from "@storybook/react";
import {
  PresenceAvatars,
  TypingIndicator,
  ReactionBar,
  CommentThread,
  VoteButtons,
  UserCard,
  ShareSheet,
  Button,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Collaboration" };
export default meta;
type Story = StoryObj;

const users = [
  { id: "1", name: "Ada Lovelace", status: "online" as const },
  { id: "2", name: "Grace Hopper", status: "online" as const },
  { id: "3", name: "Alan Turing", status: "away" as const },
  { id: "4", name: "Linus Torvalds", status: "offline" as const },
];

export const Presence: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="PresenceAvatars">
        <PresenceAvatars users={users} showCount />
      </Cell>
      <Cell title="TypingIndicator">
        <TypingIndicator users={["Ada", "Grace"]} />
      </Cell>
      <Cell title="ReactionBar" minWidth={260}>
        <ReactionBar
          onToggle={() => {}}
          onAdd={() => {}}
          reactions={[
            { emoji: "👍", count: 12, reacted: true },
            { emoji: "🎉", count: 4 },
            { emoji: "❤️", count: 8 },
          ]}
        />
      </Cell>
      <Cell title="VoteButtons">
        <VoteButtons score={42} />
      </Cell>
    </Grid>
  ),
};

export const Social: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="UserCard" minWidth={300}>
        <UserCard
          name="Ada Lovelace"
          handle="@ada"
          status="online"
          bio="Mathematician & first programmer."
          stats={[
            { label: "Repos", value: 24 },
            { label: "Followers", value: "1.2k" },
          ]}
          actions={<Button size="sm">Follow</Button>}
        />
      </Cell>
      <Cell title="ShareSheet" minWidth={340}>
        <ShareSheet url="https://msr.dev/components" />
      </Cell>
      <Cell title="CommentThread" minWidth={360}>
        <CommentThread
          onSubmit={() => {}}
          onReply={() => {}}
          comments={[
            {
              id: "1",
              author: "Grace Hopper",
              timestamp: "2h ago",
              body: "Love the new theming system!",
              replies: [{ id: "1a", author: "Ada Lovelace", timestamp: "1h ago", body: "Agreed — 15 themes 🤯" }],
            },
          ]}
        />
      </Cell>
    </Grid>
  ),
};
