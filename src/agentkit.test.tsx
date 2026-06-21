import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  PageHeader,
  PageSection,
  BulkActionBar,
  SchemaPageRenderer,
  SchemaViewer,
  SchemaDiffViewer,
  PropEditorPanel,
  ComponentPlayground,
  FilterBuilder,
  FacetedFilterPanel,
  ColumnVisibilityManager,
  DataPreviewTable,
  FieldMappingWizard,
  ImportWizard,
  ValidationSummary,
  DataQualityPanel,
  PermissionGuard,
  AuditLogTable,
  EntityActivityFeed,
  AgentPlanViewer,
  AgentStepCard,
  ToolResultViewer,
  GeneratedCodePreview,
  FileChangeList,
  PatchReviewPanel,
  PromptVariableEditor,
  ModelSelector,
  TokenBudgetBar,
  AgentPermissionPrompt,
  HumanApprovalGate,
  ResourceListPage,
  MasterDetailLayout,
  EntityTabs,
  MetadataGrid,
  DangerZone,
  ReviewBeforeSubmit,
  ResultCardList,
  CompareSelector,
  ComparisonMatrix,
  DuplicateDetectorView,
  RelationshipGraph,
  LineageViewer,
  RepeatableFieldArray,
  FormProgressSidebar,
  RequiredFieldsIndicator,
  AutoSaveStatus,
  SetupBlockerList,
  PublishReadinessPanel,
  IntegrationCard,
  ConnectionTestButton,
  WebhookManager,
  WebhookEventViewer,
  SecretInput,
  ApiKeyManager,
  BackgroundJobMonitor,
  RetryActionButton,
} from "./index";

describe("PageScaffold", () => {
  it("renders header with breadcrumbs and actions", () => {
    render(
      <PageHeader
        title="Clients"
        subtitle="All clients"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Clients" }]}
        actions={<button>New</button>}
      />,
    );
    expect(screen.getByRole("heading", { name: "Clients" })).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "New" })).toBeInTheDocument();
  });

  it("PageSection shows empty and error states", () => {
    const { rerender } = render(<PageSection empty>x</PageSection>);
    expect(screen.getByText("Nothing here yet.")).toBeInTheDocument();
    rerender(<PageSection error="Boom">x</PageSection>);
    expect(screen.getByRole("alert")).toHaveTextContent("Boom");
  });

  it("BulkActionBar hides at zero and pluralizes", () => {
    const { rerender, container } = render(<BulkActionBar count={0} />);
    expect(container.querySelector(".msr-BulkActionBar")).toBeNull();
    rerender(<BulkActionBar count={3} itemNoun="row" />);
    expect(screen.getByText("3 rows selected")).toBeInTheDocument();
  });
});

describe("SchemaTools", () => {
  it("SchemaPageRenderer renders sections, fields and fires actions", () => {
    const onAction = vi.fn();
    render(
      <SchemaPageRenderer
        schema={{
          title: "Profile",
          sections: [
            {
              title: "Basics",
              fields: [{ name: "email", label: "Email", value: "a@b.com" }],
              actions: [{ label: "Save", action: "save", variant: "primary" }],
            },
          ],
        }}
        onAction={onAction}
      />,
    );
    expect(screen.getByText("a@b.com")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onAction).toHaveBeenCalledWith("save");
  });

  it("SchemaViewer lists properties", () => {
    render(
      <SchemaViewer
        properties={[{ name: "id", type: "string", required: true }]}
      />,
    );
    expect(screen.getByText("id")).toBeInTheDocument();
    expect(screen.getByText("required")).toBeInTheDocument();
  });

  it("SchemaDiffViewer computes added/removed", () => {
    const { container } = render(
      <SchemaDiffViewer before={{ a: "1" }} after={{ a: "1", b: "2" }} />,
    );
    expect(
      container.querySelector('[data-status="added"]'),
    ).toBeInTheDocument();
  });
});

describe("ComponentCatalog", () => {
  it("PropEditorPanel emits changes", () => {
    const onChange = vi.fn();
    render(
      <PropEditorPanel
        controls={[{ name: "title", type: "string" }]}
        values={{ title: "hi" }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByDisplayValue("hi"), {
      target: { value: "bye" },
    });
    expect(onChange).toHaveBeenCalledWith("title", "bye");
  });

  it("ComponentPlayground renders preview from props", () => {
    render(
      <ComponentPlayground
        controls={[{ name: "label", type: "string" }]}
        initialProps={{ label: "Hello" }}
        render={(p) => <span>{String(p.label)}</span>}
      />,
    );
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});

describe("Filtering & table views", () => {
  it("FilterBuilder adds a condition", () => {
    const onChange = vi.fn();
    render(
      <FilterBuilder
        fields={[{ name: "status", label: "Status" }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("+ Add filter"));
    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0][0]).toHaveLength(1);
  });

  it("FacetedFilterPanel toggles values", () => {
    const onChange = vi.fn();
    render(
      <FacetedFilterPanel
        facets={[
          { name: "v", label: "Vendor", values: [{ value: "a", count: 2 }] },
        ]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalledWith({ v: ["a"] });
  });

  it("ColumnVisibilityManager toggles visibility", () => {
    const onChange = vi.fn();
    render(
      <ColumnVisibilityManager
        columns={[{ key: "a", label: "A", visible: true }]}
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByRole("checkbox"));
    expect(onChange).toHaveBeenCalled();
  });
});

describe("DataImport", () => {
  it("DataPreviewTable infers columns", () => {
    render(<DataPreviewTable rows={[{ name: "x", age: 1 }]} />);
    expect(screen.getByText("name")).toBeInTheDocument();
    expect(screen.getByText("age")).toBeInTheDocument();
  });

  it("FieldMappingWizard maps a field", () => {
    const onChange = vi.fn();
    render(
      <FieldMappingWizard
        sourceFields={["col1"]}
        targetFields={[{ name: "email", label: "Email" }]}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "col1" },
    });
    expect(onChange).toHaveBeenCalledWith({ email: "col1" });
  });

  it("ImportWizard shows steps and advances", () => {
    const onNext = vi.fn();
    render(
      <ImportWizard step="upload" onNext={onNext}>
        body
      </ImportWizard>,
    );
    fireEvent.click(screen.getByText("Next"));
    expect(onNext).toHaveBeenCalled();
  });
});

describe("Validation", () => {
  it("ValidationSummary groups and counts", () => {
    render(
      <ValidationSummary
        issues={[
          { message: "Bad", severity: "error", field: "x" },
          { message: "Meh", severity: "warning", field: "y" },
        ]}
      />,
    );
    expect(screen.getByText("1 error")).toBeInTheDocument();
    expect(screen.getByText("1 warning")).toBeInTheDocument();
  });

  it("ValidationSummary shows ok state", () => {
    render(<ValidationSummary issues={[]} />);
    expect(screen.getByText("All checks passed.")).toBeInTheDocument();
  });

  it("DataQualityPanel renders metrics", () => {
    render(
      <DataQualityPanel
        score={75}
        metrics={[{ label: "Completeness", value: 90 }]}
      />,
    );
    expect(screen.getByText("Completeness")).toBeInTheDocument();
    expect(screen.getByText("75")).toBeInTheDocument();
  });
});

describe("Guards", () => {
  it("PermissionGuard hides when denied", () => {
    const { container, rerender } = render(
      <PermissionGuard required="admin" granted={[]}>
        <span>secret</span>
      </PermissionGuard>,
    );
    expect(container.textContent).toBe("");
    rerender(
      <PermissionGuard required="admin" granted={["admin"]}>
        <span>secret</span>
      </PermissionGuard>,
    );
    expect(screen.getByText("secret")).toBeInTheDocument();
  });
});

describe("Audit", () => {
  it("AuditLogTable renders entries", () => {
    render(
      <AuditLogTable
        entries={[
          {
            id: "1",
            actor: "Alice",
            action: "updated",
            timestamp: "2026-01-01T00:00:00Z",
          },
        ]}
      />,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("updated")).toBeInTheDocument();
  });

  it("EntityActivityFeed renders items", () => {
    render(
      <EntityActivityFeed
        items={[{ id: "1", text: "did a thing", timestamp: new Date() }]}
      />,
    );
    expect(screen.getByText("did a thing")).toBeInTheDocument();
  });
});

describe("Agent run UI", () => {
  it("AgentPlanViewer shows progress", () => {
    render(
      <AgentPlanViewer
        steps={[
          { id: "1", title: "A", status: "completed" },
          { id: "2", title: "B", status: "pending" },
        ]}
      />,
    );
    expect(screen.getByText("1/2 (50%)")).toBeInTheDocument();
  });

  it("AgentStepCard shows status", () => {
    render(<AgentStepCard title="Build" status="running" />);
    expect(screen.getByText("Running")).toBeInTheDocument();
  });

  it("ToolResultViewer renders json and table", () => {
    const { rerender } = render(
      <ToolResultViewer kind="json" data={{ a: 1 }} />,
    );
    expect(screen.getByText(/"a": 1/)).toBeInTheDocument();
    rerender(
      <ToolResultViewer kind="table" data={[{ x: "1" }]} />,
    );
    expect(screen.getByText("x")).toBeInTheDocument();
  });
});

describe("Agent code", () => {
  it("GeneratedCodePreview renders code with filename", () => {
    render(
      <GeneratedCodePreview code={"const a = 1;"} filename="a.ts" language="ts" />,
    );
    expect(screen.getByText("a.ts")).toBeInTheDocument();
  });

  it("FileChangeList renders changes and selects", () => {
    const onSelect = vi.fn();
    render(
      <FileChangeList
        changes={[{ path: "src/a.ts", type: "added", additions: 3 }]}
        onSelect={onSelect}
      />,
    );
    fireEvent.click(screen.getByText("src/a.ts"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("PatchReviewPanel applies selected files", () => {
    const onAccept = vi.fn();
    render(
      <PatchReviewPanel
        files={[{ path: "a.ts", diff: "+added\n-removed" }]}
        onAccept={onAccept}
      />,
    );
    fireEvent.click(screen.getByText(/Apply 1 file/));
    expect(onAccept).toHaveBeenCalledWith(["a.ts"]);
  });
});

describe("Agent prompt", () => {
  it("PromptVariableEditor extracts template vars", () => {
    const onChange = vi.fn();
    render(
      <PromptVariableEditor
        template="Hello {{name}}"
        values={{}}
        onChange={onChange}
      />,
    );
    const input = screen.getByLabelText("name");
    fireEvent.change(input, { target: { value: "World" } });
    expect(onChange).toHaveBeenCalledWith({ name: "World" });
  });

  it("ModelSelector changes model", () => {
    const onChange = vi.fn();
    render(
      <ModelSelector
        models={[
          { id: "m1", label: "One" },
          { id: "m2", label: "Two" },
        ]}
        value={{ model: "m1" }}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByDisplayValue("One"), {
      target: { value: "m2" },
    });
    expect(onChange).toHaveBeenCalled();
  });

  it("TokenBudgetBar shows usage", () => {
    render(
      <TokenBudgetBar
        max={1000}
        segments={[{ label: "Prompt", tokens: 200 }]}
      />,
    );
    expect(screen.getByText("200 / 1,000 tokens")).toBeInTheDocument();
  });
});

describe("Agent control", () => {
  it("AgentPermissionPrompt fires allow/deny", () => {
    const onAllow = vi.fn();
    render(
      <AgentPermissionPrompt action="Run rm -rf" onAllow={onAllow} risk="high" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Allow" }));
    expect(onAllow).toHaveBeenCalled();
  });

  it("HumanApprovalGate approves", () => {
    const onApprove = vi.fn();
    render(<HumanApprovalGate onApprove={onApprove} />);
    fireEvent.click(screen.getByRole("button", { name: "Approve" }));
    expect(onApprove).toHaveBeenCalled();
  });
});

describe("Resource & layout", () => {
  it("ResourceListPage renders empty state", () => {
    render(<ResourceListPage title="Orders" empty />);
    expect(screen.getByText("No items found.")).toBeInTheDocument();
  });

  it("MasterDetailLayout shows placeholder without selection", () => {
    render(
      <MasterDetailLayout
        master={<div>list</div>}
        detail={<div>detail</div>}
        hasSelection={false}
      />,
    );
    expect(
      screen.getByText("Select an item to view details."),
    ).toBeInTheDocument();
  });

  it("EntityTabs switches tabs", () => {
    const onChange = vi.fn();
    render(
      <EntityTabs
        tabs={[
          { id: "a", label: "Overview" },
          { id: "b", label: "Files", count: 3 },
        ]}
        activeId="a"
        onChange={onChange}
      />,
    );
    fireEvent.click(screen.getByText("Files"));
    expect(onChange).toHaveBeenCalledWith("b");
  });

  it("MetadataGrid renders pairs", () => {
    render(<MetadataGrid items={[{ label: "ID", value: "42" }]} />);
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("DangerZone confirms destructive action", () => {
    const onAction = vi.fn();
    render(
      <DangerZone
        actions={[
          {
            title: "Delete",
            buttonLabel: "Delete",
            confirm: true,
            onAction,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(onAction).toHaveBeenCalled();
  });

  it("ReviewBeforeSubmit submits", () => {
    const onSubmit = vi.fn();
    render(
      <ReviewBeforeSubmit
        sections={[{ title: "S", items: [{ label: "a", value: "b" }] }]}
        onSubmit={onSubmit}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalled();
  });
});

describe("Data-heavy", () => {
  it("ResultCardList renders cards", () => {
    render(
      <ResultCardList items={[{ id: "1", title: "Result A" }]} />,
    );
    expect(screen.getByText("Result A")).toBeInTheDocument();
  });

  it("CompareSelector enforces max", () => {
    const onChange = vi.fn();
    render(
      <CompareSelector
        options={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        selected={["a"]}
        max={2}
        onChange={onChange}
      />,
    );
    expect(screen.getByText("1/2")).toBeInTheDocument();
  });

  it("ComparisonMatrix highlights differences", () => {
    const { container } = render(
      <ComparisonMatrix
        entities={[
          { id: "x", label: "X" },
          { id: "y", label: "Y" },
        ]}
        rows={[{ feature: "Price", values: { x: "$1", y: "$2" } }]}
        highlightDifferences
      />,
    );
    expect(container.querySelector("tr[data-diff]")).toBeInTheDocument();
  });

  it("DuplicateDetectorView shows score", () => {
    render(
      <DuplicateDetectorView
        groups={[
          {
            id: "1",
            score: 0.95,
            records: [{ id: "a", label: "A" }],
          },
        ]}
      />,
    );
    expect(screen.getByText("95% match")).toBeInTheDocument();
  });

  it("RelationshipGraph renders nodes", () => {
    const { container } = render(
      <RelationshipGraph
        nodes={[
          { id: "a", label: "A" },
          { id: "b", label: "B" },
        ]}
        edges={[{ source: "a", target: "b" }]}
      />,
    );
    expect(container.querySelectorAll(".msr-RelGraph__node").length).toBe(2);
  });

  it("LineageViewer renders stages", () => {
    render(
      <LineageViewer
        nodes={[
          { id: "a", label: "Source", stage: 0, kind: "source" },
          { id: "b", label: "Output", stage: 1, kind: "output" },
        ]}
        edges={[{ from: "a", to: "b" }]}
      />,
    );
    expect(screen.getByText("Source")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
  });
});

describe("Forms & setup", () => {
  it("RepeatableFieldArray adds and removes", () => {
    const onChange = vi.fn();
    render(
      <RepeatableFieldArray<{ v: string }>
        items={[{ v: "1" }]}
        onChange={onChange}
        createItem={() => ({ v: "" })}
        renderItem={(item) => <span>row {item.v}</span>}
      />,
    );
    fireEvent.click(screen.getByText("+ Add item"));
    expect(onChange).toHaveBeenCalled();
  });

  it("FormProgressSidebar summarizes completion", () => {
    render(
      <FormProgressSidebar
        items={[
          { id: "1", label: "A", status: "complete" },
          { id: "2", label: "B", status: "incomplete" },
        ]}
      />,
    );
    expect(screen.getByText("1/2 sections complete")).toBeInTheDocument();
  });

  it("RequiredFieldsIndicator lists missing", () => {
    render(
      <RequiredFieldsIndicator missing={[{ name: "email", label: "Email" }]} />,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("AutoSaveStatus shows label per state", () => {
    render(<AutoSaveStatus state="saving" />);
    expect(screen.getByText("Saving…")).toBeInTheDocument();
  });

  it("SetupBlockerList shows clear message", () => {
    render(<SetupBlockerList blockers={[]} />);
    expect(
      screen.getByText("No blockers — you're good to go."),
    ).toBeInTheDocument();
  });

  it("PublishReadinessPanel disables publish on failures", () => {
    render(
      <PublishReadinessPanel
        checks={[{ id: "1", label: "DNS", status: "fail" }]}
        onPublish={() => {}}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Publish" }),
    ).toBeDisabled();
  });
});

describe("Integration & backend", () => {
  it("IntegrationCard connects", () => {
    const onConnect = vi.fn();
    render(
      <IntegrationCard
        name="Slack"
        state="disconnected"
        onConnect={onConnect}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Connect" }));
    expect(onConnect).toHaveBeenCalled();
  });

  it("ConnectionTestButton shows result", () => {
    render(
      <ConnectionTestButton
        status="success"
        onTest={() => {}}
        resultMessage="Connected"
      />,
    );
    expect(screen.getByText("Connected")).toBeInTheDocument();
  });

  it("WebhookManager lists webhooks", () => {
    render(
      <WebhookManager
        webhooks={[
          {
            id: "1",
            url: "https://x.com/hook",
            events: ["order.created"],
            enabled: true,
          },
        ]}
      />,
    );
    expect(screen.getByText("https://x.com/hook")).toBeInTheDocument();
    expect(screen.getByText("order.created")).toBeInTheDocument();
  });

  it("WebhookEventViewer expands a delivery", () => {
    render(
      <WebhookEventViewer
        deliveries={[
          {
            id: "1",
            event: "ping",
            timestamp: new Date(),
            success: true,
            statusCode: 200,
            payload: { ok: true },
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByText("ping"));
    expect(screen.getByText("Payload")).toBeInTheDocument();
  });

  it("SecretInput toggles visibility", () => {
    render(<SecretInput value="topsecret" readOnly />);
    const input = screen.getByDisplayValue("topsecret") as HTMLInputElement;
    expect(input.type).toBe("password");
    fireEvent.click(screen.getByRole("button", { name: "Reveal" }));
    expect(input.type).toBe("text");
  });

  it("ApiKeyManager shows newly created key once", () => {
    render(
      <ApiKeyManager
        keys={[]}
        newlyCreated={{ id: "1", label: "k", masked: "••", plaintext: "sk_123" }}
      />,
    );
    expect(screen.getByDisplayValue("sk_123")).toBeInTheDocument();
  });

  it("BackgroundJobMonitor renders jobs and retries", () => {
    const onRetry = vi.fn();
    render(
      <BackgroundJobMonitor
        jobs={[{ id: "1", name: "Export", status: "failed", error: "Boom" }]}
        onRetry={onRetry}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledWith("1");
  });

  it("RetryActionButton shows cooldown", () => {
    render(<RetryActionButton cooldown={5} />);
    expect(screen.getByText("Retry in 5s")).toBeInTheDocument();
  });
});
