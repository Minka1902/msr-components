import type { Meta, StoryObj } from "@storybook/react";
import {
  Calendar,
  MiniCalendar,
  DatePicker,
  DateRangePicker,
  TimePicker,
  DateTimePicker,
  EventCalendar,
  Scheduler,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Calendar & Scheduling" };
export default meta;
type Story = StoryObj;

const Y = new Date().getFullYear();
const M = new Date().getMonth();

export const Pickers: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Calendar" minWidth={280}>
        <Calendar value={new Date(Y, M, 12)} />
      </Cell>
      <Cell title="MiniCalendar" minWidth={240}>
        <MiniCalendar defaultValue={new Date(Y, M, 12)} markedDays={[new Date(Y, M, 5), new Date(Y, M, 18)]} />
      </Cell>
      <Cell title="DatePicker">
        <DatePicker />
      </Cell>
      <Cell title="DateRangePicker">
        <DateRangePicker />
      </Cell>
      <Cell title="TimePicker">
        <TimePicker />
      </Cell>
      <Cell title="DateTimePicker">
        <DateTimePicker />
      </Cell>
    </Grid>
  ),
};

export const EventViews: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 760 }}>
      <EventCalendar
        defaultMonth={new Date(Y, M, 1)}
        events={[
          { id: "1", date: new Date(Y, M, 8), title: "Standup", tone: "info" },
          { id: "2", date: new Date(Y, M, 8), title: "Design review", tone: "success" },
          { id: "3", date: new Date(Y, M, 15), title: "Release", tone: "danger" },
          { id: "4", date: new Date(Y, M, 22), title: "1:1", tone: "warning" },
        ]}
      />
      <Scheduler
        view="day"
        date={new Date(Y, M, 8)}
        events={[
          { id: "a", title: "Focus", start: new Date(Y, M, 8, 9), end: new Date(Y, M, 8, 11), tone: "primary" },
          { id: "b", title: "Lunch", start: new Date(Y, M, 8, 12), end: new Date(Y, M, 8, 13), tone: "success" },
          { id: "c", title: "Review", start: new Date(Y, M, 8, 15), end: new Date(Y, M, 8, 16, 30), tone: "warning" },
        ]}
      />
    </div>
  ),
};
