import type { Meta, StoryObj } from "@storybook/react";
import { MetricCard, ActivityTimeline, HealthScoreCard } from "../dashboard";
import { FileTreeExplorer } from "../inspector";
import { Marketplace } from "../modules";
import { ProfileHeader } from "../profile";
import { GuessInput } from "../quiz";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Domain Modules" };
export default meta;
type Story = StoryObj;

export const Dashboard: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="MetricCard" minWidth={240}>
        <MetricCard label="Active users" value="12,480" icon="users" trend={{ value: 8, direction: "up" }} sparkline={[5, 8, 6, 10, 9, 12, 14]} />
      </Cell>
      <Cell title="HealthScoreCard" minWidth={260}>
        <HealthScoreCard
          score={82}
          title="Project health"
          breakdown={[
            { label: "Coverage", value: 90 },
            { label: "Freshness", value: 70 },
            { label: "Risk", value: 85 },
          ]}
        />
      </Cell>
      <Cell title="ActivityTimeline" minWidth={300}>
        <ActivityTimeline
          items={[
            { id: "1", title: "Deployed v2.1", timestamp: "2h ago", tone: "success" },
            { id: "2", title: "Opened PR #42", description: "Add chart power-ups", timestamp: "5h ago", tone: "info" },
            { id: "3", title: "Build failed", timestamp: "1d ago", tone: "danger" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const Inspector: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <FileTreeExplorer
        defaultExpanded={["root", "src"]}
        data={[
          {
            id: "root",
            name: "project",
            type: "folder",
            children: [
              {
                id: "src",
                name: "src",
                type: "folder",
                children: [
                  { id: "a", name: "index.ts", type: "file" },
                  { id: "b", name: "app.bin", type: "file" },
                ],
              },
              { id: "pkg", name: "package.json", type: "file" },
            ],
          },
        ]}
      />
    </div>
  ),
};

export const Modules: Story = {
  render: () => (
    <Marketplace
      columns={2}
      modules={[
        { id: "pay", name: "Payments", description: "Accept cards and wallets.", enabled: true },
        { id: "crm", name: "Client Profiles", description: "Manage your clients.", enabled: false },
        { id: "book", name: "Bookings", description: "Scheduling & calendars.", enabled: false },
        { id: "msg", name: "Messaging", description: "In-app chat.", enabled: true },
      ]}
    />
  ),
};

const countries = [
  { code: "US", name: "United States", flag: "🇺🇸", continent: "N. America" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", continent: "S. America" },
  { code: "JP", name: "Japan", flag: "🇯🇵", continent: "Asia" },
  { code: "FR", name: "France", flag: "🇫🇷", continent: "Europe" },
];

export const Profile_and_Quiz: Story = {
  name: "Profile & Quiz",
  render: () => (
    <Grid gap={32}>
      <Cell title="ProfileHeader" minWidth={360}>
        <ProfileHeader
          name="Rex"
          breed="Border Collie"
          age="3 yrs"
          status={{ label: "Healthy", tone: "success" }}
          humans={[
            { id: "1", name: "Sam Carter", role: "Owner" },
            { id: "2", name: "Jo Lee", role: "Walker" },
          ]}
        />
      </Cell>
      <Cell title="GuessInput" minWidth={280}>
        <GuessInput countries={countries} />
      </Cell>
    </Grid>
  ),
};
