import type { Meta, StoryObj } from "@storybook/react";
import {
  PageHeader,
  PageSection,
  BulkActionBar,
  SchemaPageRenderer,
  SchemaViewer,
  SchemaDiffViewer,
  FilterBuilder,
  FacetedFilterPanel,
  ColumnVisibilityManager,
  DataPreviewTable,
  ValidationSummary,
  DataQualityPanel,
  AgentPlanViewer,
  AgentStepCard,
  AgentRunTimeline,
  ToolResultViewer,
  GeneratedCodePreview,
  FileChangeList,
  PatchReviewPanel,
  ModelSelector,
  TokenBudgetBar,
  AgentPermissionPrompt,
  HumanApprovalGate,
  EntityTabs,
  MetadataGrid,
  DangerZone,
  ResultCardList,
  ComparisonMatrix,
  DuplicateDetectorView,
  RelationshipGraph,
  LineageViewer,
  FormProgressSidebar,
  RequiredFieldsIndicator,
  AutoSaveStatus,
  DraftRestoreBanner,
  SetupBlockerList,
  PublishReadinessPanel,
  IntegrationCard,
  ConnectionTestButton,
  SyncStatusCard,
  WebhookManager,
  WebhookEventViewer,
  SecretInput,
  ApiKeyManager,
  BackgroundJobMonitor,
  RetryActionButton,
  CitationList,
  ResponseFeedback,
  SuggestedPrompts,
  MessageActions,
  ConversationList,
  CostEstimator,
  ConfidenceMeter,
  LatencyBadge,
  RateLimitBanner,
  UsageMeter,
  KeyValueEditor,
  EnvVarEditor,
  HeadersEditor,
  TrendIndicator,
  MetricCard,
  StatComparison,
  KpiGrid,
  StatusDot,
  HealthIndicator,
  ServiceStatusList,
  Heartbeat,
  IncidentBanner,
  NotificationItem,
  NotificationCenter,
  AnnouncementBanner,
  FileUploader,
  UploadList,
  AttachmentChip,
  FilePreviewCard,
  PlanCard,
  BillingSummary,
  InvoiceList,
  UsageBreakdown,
  NpsSurvey,
  EmojiRating,
  SurveyForm,
  FeedbackForm,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Agent App Kit" };
export default meta;
type Story = StoryObj;

export const PageScaffolding: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="PageHeader" minWidth={520}>
        <PageHeader
          title="Clients"
          subtitle="Manage all client accounts"
          breadcrumbs={[{ label: "Home", href: "#" }, { label: "Clients" }]}
          actions={<button>+ New client</button>}
        />
      </Cell>
      <Cell title="PageSection" minWidth={420}>
        <PageSection title="Recent" description="Last 30 days">
          <p style={{ margin: 0 }}>Section content goes here.</p>
        </PageSection>
      </Cell>
      <Cell title="BulkActionBar" minWidth={360}>
        <BulkActionBar
          count={3}
          itemNoun="row"
          actions={<button>Delete</button>}
          onClear={() => {}}
        />
      </Cell>
    </Grid>
  ),
};

export const SchemaAndData: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="SchemaPageRenderer" minWidth={520}>
        <SchemaPageRenderer
          schema={{
            title: "Order #1042",
            sections: [
              {
                title: "Summary",
                columns: 2,
                fields: [
                  { name: "status", label: "Status", value: "Shipped" },
                  { name: "total", label: "Total", value: "$129.00" },
                ],
              },
            ],
          }}
        />
      </Cell>
      <Cell title="SchemaViewer" minWidth={460}>
        <SchemaViewer
          name="User"
          properties={[
            { name: "id", type: "string", required: true },
            { name: "role", type: "enum", enumValues: ["admin", "user"] },
          ]}
        />
      </Cell>
      <Cell title="SchemaDiffViewer" minWidth={320}>
        <SchemaDiffViewer
          before={{ name: "string", age: "number" }}
          after={{ name: "string", email: "string" }}
        />
      </Cell>
      <Cell title="DataPreviewTable" minWidth={360}>
        <DataPreviewTable
          rows={[
            { name: "Ada", role: "admin" },
            { name: "Linus", role: "user" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const FilteringAndValidation: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="FilterBuilder" minWidth={420}>
        <FilterBuilder
          fields={[
            { name: "status", label: "Status", type: "enum", options: [{ label: "Open", value: "open" }] },
            { name: "amount", label: "Amount", type: "number" },
          ]}
          value={[{ id: "c1", field: "status", operator: "is", value: "open" }]}
        />
      </Cell>
      <Cell title="FacetedFilterPanel" minWidth={240}>
        <FacetedFilterPanel
          facets={[
            {
              name: "vendor",
              label: "Vendor",
              values: [
                { value: "acme", count: 12 },
                { value: "globex", count: 5 },
              ],
            },
          ]}
        />
      </Cell>
      <Cell title="ColumnVisibilityManager" minWidth={260}>
        <ColumnVisibilityManager
          columns={[
            { key: "id", label: "ID", locked: true, visible: true },
            { key: "name", label: "Name", visible: true },
            { key: "email", label: "Email", visible: false },
          ]}
          onChange={() => {}}
        />
      </Cell>
      <Cell title="ValidationSummary" minWidth={360}>
        <ValidationSummary
          issues={[
            { message: "Email is required", severity: "error", field: "email" },
            { message: "Name is short", severity: "warning", field: "name" },
          ]}
        />
      </Cell>
      <Cell title="DataQualityPanel" minWidth={360}>
        <DataQualityPanel
          score={82}
          metrics={[
            { label: "Completeness", value: 92 },
            { label: "Validity", value: 70 },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

const now = new Date();

export const AgentUI: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="AgentPlanViewer" minWidth={360}>
        <AgentPlanViewer
          steps={[
            { id: "1", title: "Read files", status: "completed" },
            { id: "2", title: "Generate diff", status: "running" },
            { id: "3", title: "Run tests", status: "pending" },
          ]}
        />
      </Cell>
      <Cell title="AgentStepCard" minWidth={360}>
        <AgentStepCard
          index={2}
          title="Apply migration"
          description="Adds the orders table"
          status="awaiting-approval"
          actions={<button>Approve</button>}
        />
      </Cell>
      <Cell title="AgentRunTimeline" minWidth={360}>
        <AgentRunTimeline
          events={[
            { id: "1", type: "prompt", title: "User prompt", timestamp: now },
            { id: "2", type: "tool-call", title: "read_file(a.ts)", timestamp: now },
            { id: "3", type: "error", title: "Type error", content: "TS2322", timestamp: now },
          ]}
        />
      </Cell>
      <Cell title="ToolResultViewer" minWidth={360}>
        <ToolResultViewer kind="json" name="get_user" data={{ id: 1, name: "Ada" }} />
      </Cell>
      <Cell title="GeneratedCodePreview" minWidth={360}>
        <GeneratedCodePreview
          filename="hello.ts"
          language="ts"
          lineNumbers
          code={'export const hi = () => "hi";'}
        />
      </Cell>
      <Cell title="FileChangeList" minWidth={360}>
        <FileChangeList
          changes={[
            { path: "src/a.ts", type: "added", additions: 12 },
            { path: "src/b.ts", type: "modified", additions: 3, deletions: 1 },
            { path: "src/c.ts", type: "deleted", deletions: 40 },
          ]}
        />
      </Cell>
      <Cell title="PatchReviewPanel" minWidth={420}>
        <PatchReviewPanel
          files={[{ path: "src/a.ts", diff: " const a = 1;\n-const b = 2;\n+const b = 3;" }]}
        />
      </Cell>
      <Cell title="ModelSelector" minWidth={280}>
        <ModelSelector
          models={[{ id: "opus", label: "Opus", provider: "Anthropic" }]}
          value={{ model: "opus", temperature: 0.7, reasoning: "high" }}
          onChange={() => {}}
        />
      </Cell>
      <Cell title="TokenBudgetBar" minWidth={360}>
        <TokenBudgetBar
          max={200000}
          segments={[
            { label: "System", tokens: 5000, tone: "muted" },
            { label: "Context", tokens: 80000, tone: "primary" },
            { label: "Output", tokens: 20000, tone: "info" },
          ]}
        />
      </Cell>
      <Cell title="AgentPermissionPrompt" minWidth={420}>
        <AgentPermissionPrompt
          action="Run a shell command"
          detail="rm -rf ./build"
          risk="high"
        />
      </Cell>
      <Cell title="HumanApprovalGate" minWidth={420}>
        <HumanApprovalGate
          description="The agent wants to deploy to production."
          preview="deploy --env=prod"
        />
      </Cell>
    </Grid>
  ),
};

export const EntitiesAndComparison: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="EntityTabs" minWidth={420}>
        <EntityTabs
          tabs={[
            { id: "o", label: "Overview" },
            { id: "f", label: "Files", count: 4 },
            { id: "h", label: "History" },
          ]}
          activeId="o"
          onChange={() => {}}
        />
      </Cell>
      <Cell title="MetadataGrid" minWidth={360}>
        <MetadataGrid
          items={[
            { label: "ID", value: "ord_1042" },
            { label: "Status", value: "Shipped" },
            { label: "Created", value: "2026-01-01" },
            { label: "Owner", value: "Ada" },
          ]}
        />
      </Cell>
      <Cell title="DangerZone" minWidth={420}>
        <DangerZone
          actions={[
            {
              title: "Delete project",
              description: "This cannot be undone.",
              buttonLabel: "Delete",
              confirm: true,
              onAction: () => {},
            },
          ]}
        />
      </Cell>
      <Cell title="ResultCardList" minWidth={420}>
        <ResultCardList
          items={[
            { id: "1", title: "Result A", description: "First match", meta: "score 0.98" },
            { id: "2", title: "Result B", description: "Second match", meta: "score 0.91" },
          ]}
        />
      </Cell>
      <Cell title="ComparisonMatrix" minWidth={420}>
        <ComparisonMatrix
          entities={[
            { id: "a", label: "Basic" },
            { id: "b", label: "Pro" },
          ]}
          rows={[
            { feature: "Seats", values: { a: "1", b: "10" } },
            { feature: "Support", values: { a: "Email", b: "24/7" } },
          ]}
          highlightDifferences
        />
      </Cell>
      <Cell title="DuplicateDetectorView" minWidth={420}>
        <DuplicateDetectorView
          groups={[
            {
              id: "1",
              score: 0.92,
              matchingFields: ["email"],
              records: [
                { id: "a", label: "Ada Lovelace", fields: { email: "ada@x.com" } },
                { id: "b", label: "A. Lovelace", fields: { email: "ada@x.com" } },
              ],
            },
          ]}
          onMerge={() => {}}
        />
      </Cell>
      <Cell title="RelationshipGraph" minWidth={360}>
        <RelationshipGraph
          size={300}
          nodes={[
            { id: "u", label: "User", group: "a" },
            { id: "o", label: "Order", group: "b" },
            { id: "p", label: "Product", group: "b" },
          ]}
          edges={[
            { source: "u", target: "o" },
            { source: "o", target: "p" },
          ]}
        />
      </Cell>
      <Cell title="LineageViewer" minWidth={420}>
        <LineageViewer
          nodes={[
            { id: "s", label: "CSV upload", stage: 0, kind: "source" },
            { id: "t", label: "Normalize", stage: 1, kind: "transform" },
            { id: "o", label: "Orders table", stage: 2, kind: "output" },
          ]}
          edges={[
            { from: "s", to: "t" },
            { from: "t", to: "o" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const FormsSetupAndBackend: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="FormProgressSidebar" minWidth={240}>
        <FormProgressSidebar
          items={[
            { id: "1", label: "Account", status: "complete" },
            { id: "2", label: "Billing", status: "active" },
            { id: "3", label: "Team", status: "incomplete" },
            { id: "4", label: "Notes", status: "optional" },
          ]}
        />
      </Cell>
      <Cell title="RequiredFieldsIndicator" minWidth={320}>
        <RequiredFieldsIndicator
          total={4}
          missing={[
            { name: "email", label: "Email" },
            { name: "country", label: "Country" },
          ]}
        />
      </Cell>
      <Cell title="AutoSaveStatus" minWidth={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AutoSaveStatus state="saving" />
          <AutoSaveStatus state="saved" lastSaved={now} />
          <AutoSaveStatus state="offline" onRetry={() => {}} />
        </div>
      </Cell>
      <Cell title="DraftRestoreBanner" minWidth={420}>
        <DraftRestoreBanner savedAt={now} onRestore={() => {}} onDiscard={() => {}} />
      </Cell>
      <Cell title="SetupBlockerList" minWidth={360}>
        <SetupBlockerList
          blockers={[
            { id: "1", title: "Connect a domain", severity: "error" },
            { id: "2", title: "Add a logo", severity: "warning" },
          ]}
        />
      </Cell>
      <Cell title="PublishReadinessPanel" minWidth={360}>
        <PublishReadinessPanel
          checks={[
            { id: "1", label: "DNS verified", status: "pass" },
            { id: "2", label: "SSL", status: "warn", detail: "Expires soon" },
            { id: "3", label: "Billing", status: "fail" },
          ]}
          onPublish={() => {}}
        />
      </Cell>
      <Cell title="IntegrationCard" minWidth={360}>
        <IntegrationCard
          name="Stripe"
          description="Payments and billing"
          state="connected"
          onConfigure={() => {}}
          onDisconnect={() => {}}
        />
      </Cell>
      <Cell title="ConnectionTestButton" minWidth={300}>
        <ConnectionTestButton status="success" onTest={() => {}} />
      </Cell>
      <Cell title="SyncStatusCard" minWidth={360}>
        <SyncStatusCard
          state="syncing"
          progress={62}
          lastSync={now}
          onSyncNow={() => {}}
        />
      </Cell>
      <Cell title="WebhookManager" minWidth={460}>
        <WebhookManager
          webhooks={[
            {
              id: "1",
              url: "https://api.example.com/hook",
              events: ["order.created", "order.updated"],
              enabled: true,
            },
          ]}
          onCreate={() => {}}
          onToggle={() => {}}
          onTest={() => {}}
        />
      </Cell>
      <Cell title="WebhookEventViewer" minWidth={460}>
        <WebhookEventViewer
          deliveries={[
            { id: "1", event: "order.created", timestamp: now, success: true, statusCode: 200 },
            { id: "2", event: "order.updated", timestamp: now, success: false, statusCode: 500, retries: 2 },
          ]}
        />
      </Cell>
      <Cell title="SecretInput" minWidth={320}>
        <SecretInput value="sk_live_4f2ad8c0" copyable readOnly />
      </Cell>
      <Cell title="ApiKeyManager" minWidth={520}>
        <ApiKeyManager
          keys={[
            { id: "1", label: "Production", masked: "sk_live_••••4f2a", createdAt: now },
          ]}
          onCreate={() => {}}
          onRotate={() => {}}
          onRevoke={() => {}}
        />
      </Cell>
      <Cell title="BackgroundJobMonitor" minWidth={420}>
        <BackgroundJobMonitor
          grouped
          jobs={[
            { id: "1", name: "Export CSV", status: "running", progress: 40 },
            { id: "2", name: "Import users", status: "failed", error: "Timeout" },
            { id: "3", name: "Nightly sync", status: "completed" },
          ]}
          onRetry={() => {}}
          onCancel={() => {}}
        />
      </Cell>
      <Cell title="RetryActionButton" minWidth={200}>
        <RetryActionButton attempts={2} />
      </Cell>
    </Grid>
  ),
};

export const ConversationAndObservability: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="CitationList" minWidth={360}>
        <CitationList
          citations={[
            { id: "1", title: "Pricing docs", url: "#", source: "docs", snippet: "Plans start at $10/mo…", score: 0.94 },
            { id: "2", title: "Changelog", url: "#", source: "web", snippet: "Added SSO support." },
          ]}
        />
      </Cell>
      <Cell title="ResponseFeedback" minWidth={280}>
        <ResponseFeedback value="up" onChange={() => {}} />
      </Cell>
      <Cell title="SuggestedPrompts" minWidth={360}>
        <SuggestedPrompts
          title="Try asking"
          prompts={["Summarize this thread", "Draft a reply", "Find action items"]}
        />
      </Cell>
      <Cell title="MessageActions" minWidth={200}>
        <MessageActions copyText="hello" onRegenerate={() => {}} onEdit={() => {}} />
      </Cell>
      <Cell title="ConversationList" minWidth={280}>
        <ConversationList
          activeId="b"
          onNew={() => {}}
          conversations={[
            { id: "a", title: "Onboarding plan", preview: "Let's outline…", timestamp: now },
            { id: "b", title: "Bug triage", preview: "The crash is…", timestamp: now, unread: true },
          ]}
        />
      </Cell>
      <Cell title="CostEstimator" minWidth={320}>
        <CostEstimator
          precision={4}
          items={[
            { label: "Input tokens", units: 12000, unitPrice: 0.000003, unitLabel: "tok" },
            { label: "Output tokens", units: 3000, unitPrice: 0.000015, unitLabel: "tok" },
          ]}
        />
      </Cell>
      <Cell title="ConfidenceMeter" minWidth={260}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <ConfidenceMeter value={0.92} />
          <ConfidenceMeter value={0.55} label="Match" />
          <ConfidenceMeter value={0.2} label="Certainty" />
        </div>
      </Cell>
      <Cell title="LatencyBadge" minWidth={240}>
        <div style={{ display: "flex", gap: 8 }}>
          <LatencyBadge ms={180} />
          <LatencyBadge ms={1400} />
          <LatencyBadge ms={5200} label="p95" />
        </div>
      </Cell>
      <Cell title="RateLimitBanner" minWidth={360}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <RateLimitBanner remaining={8} limit={100} resetAt={now} />
          <RateLimitBanner remaining={0} limit={100} resetAt={now} />
        </div>
      </Cell>
      <Cell title="UsageMeter" minWidth={320}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <UsageMeter used={420} limit={1000} label="API calls" />
          <UsageMeter used={950} limit={1000} label="Storage (GB)" />
        </div>
      </Cell>
    </Grid>
  ),
};

export const KeyValueEditors: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="KeyValueEditor" minWidth={420}>
        <KeyValueEditor
          toggleable
          allowSecret
          onChange={() => {}}
          pairs={[
            { key: "region", value: "us-east-1", enabled: true },
            { key: "api_token", value: "sk_live_123", secret: true, enabled: true },
          ]}
        />
      </Cell>
      <Cell title="EnvVarEditor" minWidth={420}>
        <EnvVarEditor
          onChange={() => {}}
          vars={[
            { key: "NODE_ENV", value: "production" },
            { key: "DATABASE_URL", value: "postgres://…", secret: true },
          ]}
        />
      </Cell>
      <Cell title="HeadersEditor" minWidth={420}>
        <HeadersEditor
          onChange={() => {}}
          headers={[
            { name: "Authorization", value: "Bearer …", enabled: true },
            { name: "Content-Type", value: "application/json", enabled: true },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const MetricsAndStatus: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="KpiGrid + MetricCard" minWidth={520}>
        <KpiGrid minColumnWidth={200}>
          <MetricCard label="Revenue" value="$48.2k" delta={8.4} deltaPercent caption="vs last month" sparkline={[3, 5, 4, 6, 7, 6, 8]} />
          <MetricCard label="Active users" value="1,284" delta={2.1} deltaPercent sparkline={[5, 4, 6, 5, 7, 8, 9]} />
          <MetricCard label="Error rate" value="0.42%" delta={-0.1} deltaPercent invertTrend caption="lower is better" />
          <MetricCard label="Latency p95" value="312ms" delta={-12} invertTrend />
        </KpiGrid>
      </Cell>
      <Cell title="TrendIndicator" minWidth={240}>
        <div style={{ display: "flex", gap: 12 }}>
          <TrendIndicator delta={12.5} percent />
          <TrendIndicator delta={-3.2} percent />
          <TrendIndicator delta={-3.2} percent invert />
          <TrendIndicator delta={0} />
        </div>
      </Cell>
      <Cell title="StatComparison" minWidth={260}>
        <StatComparison label="Signups this week" current={342} previous={290} />
      </Cell>
      <Cell title="StatusDot" minWidth={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <StatusDot tone="online" label="Online" pulse />
          <StatusDot tone="busy" label="Busy" />
          <StatusDot tone="away" label="Away" />
          <StatusDot tone="offline" label="Offline" />
        </div>
      </Cell>
      <Cell title="HealthIndicator" minWidth={240}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <HealthIndicator status="operational" />
          <HealthIndicator status="degraded" />
          <HealthIndicator status="major-outage" />
          <HealthIndicator status="maintenance" />
        </div>
      </Cell>
      <Cell title="ServiceStatusList" minWidth={360}>
        <ServiceStatusList
          services={[
            { id: "1", name: "API", status: "operational", description: "REST + GraphQL" },
            { id: "2", name: "Dashboard", status: "operational" },
            { id: "3", name: "Search", status: "degraded", description: "Elevated latency" },
            { id: "4", name: "Webhooks", status: "partial-outage" },
          ]}
        />
      </Cell>
      <Cell title="Heartbeat" minWidth={240}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Heartbeat live label="Streaming" />
          <Heartbeat live={false} lastSeen={now} />
        </div>
      </Cell>
      <Cell title="IncidentBanner" minWidth={420}>
        <IncidentBanner title="Elevated error rates on Search" severity="major" updatedAt={now} href="#">
          We're investigating increased error rates and will post updates shortly.
        </IncidentBanner>
      </Cell>
    </Grid>
  ),
};

export const NotificationsAndAnnouncements: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="NotificationCenter" minWidth={380}>
        <NotificationCenter
          onMarkAllRead={() => {}}
          notifications={[
            { id: "1", title: "Deploy succeeded", body: "v1.4.0 is live in production.", tone: "success", timestamp: now },
            { id: "2", title: "New comment", body: "Ada mentioned you in “Q3 plan”.", tone: "info", timestamp: now },
            { id: "3", title: "Quota almost reached", body: "You've used 92% of your API quota.", tone: "warning", timestamp: now, read: true },
          ]}
        />
      </Cell>
      <Cell title="NotificationItem" minWidth={360}>
        <div style={{ border: "1px solid var(--msr-color-border)", borderRadius: 12, overflow: "hidden" }}>
          <NotificationItem
            title="Build failed"
            body="3 tests failed on the main branch."
            tone="danger"
            timestamp={now}
            actions={<button>View logs</button>}
            onMarkRead={() => {}}
            onDismiss={() => {}}
          />
        </div>
      </Cell>
      <Cell title="AnnouncementBanner" minWidth={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <AnnouncementBanner tone="promo" center action={<a href="#" style={{ color: "inherit" }}>Upgrade →</a>} onDismiss={() => {}}>
            🎉 New: Agent App Kit components are here
          </AnnouncementBanner>
          <AnnouncementBanner tone="warning" onDismiss={() => {}}>
            Scheduled maintenance this Sunday 02:00–04:00 UTC.
          </AnnouncementBanner>
        </div>
      </Cell>
    </Grid>
  ),
};

export const FilesAndBilling: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="FileUploader" minWidth={360}>
        <FileUploader onFiles={() => {}} hint="PNG, JPG or PDF up to 10MB" />
      </Cell>
      <Cell title="UploadList" minWidth={360}>
        <UploadList
          onCancel={() => {}}
          onRetry={() => {}}
          onRemove={() => {}}
          uploads={[
            { id: "1", name: "design.fig", size: 2_400_000, status: "uploading", progress: 64 },
            { id: "2", name: "report.pdf", size: 880_000, status: "done" },
            { id: "3", name: "broken.zip", size: 1_200_000, status: "error", error: "Network error" },
          ]}
        />
      </Cell>
      <Cell title="AttachmentChip" minWidth={300}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <AttachmentChip name="spec.pdf" size={184_000} onRemove={() => {}} />
          <AttachmentChip name="logo.svg" size={12_000} href="#" />
        </div>
      </Cell>
      <Cell title="FilePreviewCard" minWidth={360}>
        <div style={{ display: "flex", gap: 12 }}>
          <FilePreviewCard name="hero.png" size={420_000} thumbnail={<img src="https://picsum.photos/id/1018/200/120" alt="" />} actions={<a href="#">Open</a>} />
          <FilePreviewCard name="archive.zip" size={9_800_000} />
        </div>
      </Cell>
      <Cell title="PlanCard" minWidth={540}>
        <div style={{ display: "flex", gap: 16 }}>
          <PlanCard name="Starter" price="$0" period="/mo" description="For trying things out" features={[{ label: "1 project" }, { label: "Community support" }, { label: "Advanced analytics", included: false }]} ctaLabel="Get started" onSelect={() => {}} />
          <PlanCard name="Pro" price="$49" period="/mo" featured description="For growing teams" features={[{ label: "Unlimited projects" }, { label: "Priority support" }, { label: "Advanced analytics" }]} onSelect={() => {}} />
        </div>
      </Cell>
      <Cell title="BillingSummary" minWidth={520}>
        <BillingSummary planName="Pro" planPrice="$49/mo" nextInvoiceDate={now} nextInvoiceAmount="$49.00" onChangePlan={() => {}} onManage={() => {}} />
      </Cell>
      <Cell title="InvoiceList" minWidth={480}>
        <InvoiceList
          invoices={[
            { id: "1", number: "INV-0007", date: now, amount: "$49.00", status: "paid", downloadUrl: "#" },
            { id: "2", number: "INV-0006", date: now, amount: "$49.00", status: "paid", downloadUrl: "#" },
            { id: "3", number: "INV-0005", date: now, amount: "$49.00", status: "past-due", downloadUrl: "#" },
          ]}
        />
      </Cell>
      <Cell title="UsageBreakdown" minWidth={360}>
        <UsageBreakdown
          title="Usage this period"
          rows={[
            { label: "API calls", used: 8200, limit: 10000 },
            { label: "Storage", used: 19, limit: 20, unit: "GB" },
            { label: "Seats", used: 4, limit: 10 },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const SurveysAndFeedback: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="NpsSurvey" minWidth={420}>
        <NpsSurvey value={9} onChange={() => {}} />
      </Cell>
      <Cell title="EmojiRating" minWidth={280}>
        <EmojiRating value={4} onChange={() => {}} />
      </Cell>
      <Cell title="SurveyForm" minWidth={360}>
        <SurveyForm
          answers={{ q1: 4, q2: "fast" }}
          onChange={() => {}}
          onSubmit={() => {}}
          questions={[
            { id: "q1", label: "Rate your experience", type: "rating", max: 5 },
            { id: "q2", label: "What stood out?", type: "choice", options: [{ label: "Speed", value: "fast" }, { label: "Design", value: "design" }] },
            { id: "q3", label: "Anything else?", type: "text" },
          ]}
        />
      </Cell>
      <Cell title="FeedbackForm" minWidth={340}>
        <FeedbackForm withRating onSubmit={() => {}} />
      </Cell>
    </Grid>
  ),
};
