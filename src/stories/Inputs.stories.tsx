import type { Meta, StoryObj } from "@storybook/react";
import {
  Combobox,
  Slider,
  RangeSlider,
  NumberStepper,
  PinInput,
  RatingStars,
  ToggleGroup,
  TagInput,
  ColorPicker,
  SegmentedControl,
  WheelPicker,
  CreditCardInput,
  SignaturePad,
  MaskedInput,
  PhoneInput,
  Field,
  Input,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Inputs" };
export default meta;
type Story = StoryObj;

const fruits = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cherry", label: "Cherry" },
  { value: "date", label: "Date" },
];

export const Selection: Story = {
  render: () => (
    <Grid>
      <Cell title="Combobox" minWidth={240}>
        <Combobox options={fruits} placeholder="Pick a fruit" />
      </Cell>
      <Cell title="SegmentedControl" minWidth={240}>
        <SegmentedControl
          defaultValue="grid"
          options={[
            { value: "list", label: "List" },
            { value: "grid", label: "Grid" },
            { value: "board", label: "Board" },
          ]}
        />
      </Cell>
      <Cell title="ToggleGroup" minWidth={240}>
        <ToggleGroup
          defaultValue="b"
          options={[
            { value: "a", label: "Bold" },
            { value: "b", label: "Italic" },
            { value: "c", label: "Underline" },
          ]}
        />
      </Cell>
      <Cell title="WheelPicker" minWidth={160}>
        <WheelPicker
          defaultValue="3"
          options={Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }))}
          suffix="hr"
        />
      </Cell>
    </Grid>
  ),
};

export const Numeric: Story = {
  render: () => (
    <Grid>
      <Cell title="Slider" minWidth={240}>
        <Slider defaultValue={40} showValue />
      </Cell>
      <Cell title="RangeSlider" minWidth={240}>
        <RangeSlider defaultValue={[20, 70]} />
      </Cell>
      <Cell title="NumberStepper">
        <NumberStepper defaultValue={3} min={0} max={10} />
      </Cell>
      <Cell title="RatingStars">
        <RatingStars defaultValue={3} />
      </Cell>
    </Grid>
  ),
};

export const TextAndCodes: Story = {
  render: () => (
    <Grid>
      <Cell title="Field + Input" minWidth={240}>
        <Field label="Email" hint="We never share it.">
          <Input placeholder="you@example.com" />
        </Field>
      </Cell>
      <Cell title="MaskedInput" minWidth={200}>
        <MaskedInput mask="##/##/####" placeholder="DD/MM/YYYY" />
      </Cell>
      <Cell title="PhoneInput" minWidth={220}>
        <PhoneInput />
      </Cell>
      <Cell title="TagInput" minWidth={260}>
        <TagInput defaultValue={["react", "design"]} />
      </Cell>
      <Cell title="PinInput" minWidth={220}>
        <PinInput length={4} />
      </Cell>
    </Grid>
  ),
};

export const Specialized: Story = {
  render: () => (
    <Grid>
      <Cell title="ColorPicker" minWidth={240}>
        <ColorPicker defaultValue="#0ea5e9" />
      </Cell>
      <Cell title="CreditCardInput" minWidth={300}>
        <CreditCardInput showName />
      </Cell>
      <Cell title="SignaturePad" minWidth={300}>
        <SignaturePad />
      </Cell>
    </Grid>
  ),
};
