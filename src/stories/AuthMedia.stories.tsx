import type { Meta, StoryObj } from "@storybook/react";
import {
  LoginForm,
  SignupForm,
  SocialAuthButtons,
  AudioPlayer,
  VideoPlayer,
  Waveform,
  EmojiPicker,
  AvatarUploader,
  Barcode,
  QRCode,
} from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Auth & Media" };
export default meta;
type Story = StoryObj;

export const Auth: Story = {
  render: () => (
    <Grid gap={40}>
      <Cell title="LoginForm" minWidth={320}>
        <div style={{ width: 320 }}>
          <LoginForm onForgotPassword={() => {}} social={<SocialAuthButtons />} />
        </div>
      </Cell>
      <Cell title="SignupForm" minWidth={320}>
        <div style={{ width: 320 }}>
          <SignupForm />
        </div>
      </Cell>
    </Grid>
  ),
};

const peaks = Array.from({ length: 64 }, () => Math.random());

export const Media: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Waveform" minWidth={360}>
        <Waveform peaks={peaks} progress={0.4} />
      </Cell>
      <Cell title="AudioPlayer" minWidth={360}>
        <AudioPlayer src="" title="Sample track" peaks={peaks} />
      </Cell>
      <Cell title="VideoPlayer" minWidth={360}>
        <VideoPlayer src="" poster="https://picsum.photos/id/1043/640/360" title="Sample video" />
      </Cell>
      <Cell title="AvatarUploader" minWidth={140}>
        <AvatarUploader />
      </Cell>
      <Cell title="EmojiPicker" minWidth={340}>
        <EmojiPicker />
      </Cell>
    </Grid>
  ),
};

export const Codes: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="QRCode">
        <QRCode value="https://www.npmjs.com/package/msr-components" size={140} />
      </Cell>
      <Cell title="Barcode">
        <Barcode value="MSR-2024" />
      </Cell>
    </Grid>
  ),
};
