import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  Banner,
  EmptyState,
  ResultPage,
  LoadingOverlay,
  Spinner,
  Button,
  ToastProvider,
  useToast,
  SkeletonCard,
} from "../index";
import { ProgressBar } from "../charts";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Feedback" };
export default meta;
type Story = StoryObj;

export const Messages: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 560 }}>
      {(["info", "success", "warning", "danger"] as const).map((tone) => (
        <Alert key={tone} tone={tone} title={`${tone} alert`}>
          A short description explaining the {tone} state.
        </Alert>
      ))}
      <Banner tone="info">A full-width banner for announcements.</Banner>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <Grid>
      <Cell title="EmptyState" minWidth={320}>
        <EmptyState title="No results" description="Try adjusting your filters." action={<Button>Reset</Button>} />
      </Cell>
      <Cell title="ResultPage (404)" minWidth={320}>
        <ResultPage status="404" subtitle="That page doesn't exist." />
      </Cell>
    </Grid>
  ),
};

export const Loading: Story = {
  render: () => (
    <Grid>
      <Cell title="Spinner">
        <Spinner size={30} />
      </Cell>
      <Cell title="ProgressBar" minWidth={240}>
        <ProgressBar value={66} />
      </Cell>
      <Cell title="SkeletonCard" minWidth={260}>
        <SkeletonCard />
      </Cell>
      <Cell title="LoadingOverlay" minWidth={260}>
        <LoadingOverlay active label="Loading…">
          <div style={{ height: 120, borderRadius: 8, background: "var(--msr-color-surface-2)" }} />
        </LoadingOverlay>
      </Cell>
    </Grid>
  ),
};

function ToastDemo() {
  const toast = useToast();
  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Button onClick={() => toast.success("Saved!")}>Success</Button>
      <Button tone="danger" onClick={() => toast.error("Something broke")}>
        Error
      </Button>
    </div>
  );
}

export const Toasts: Story = {
  render: () => (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  ),
};
