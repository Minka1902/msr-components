import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  MagneticButton,
  RippleButton,
  ShimmerButton,
  HoldToConfirm,
  GradientText,
  Typewriter,
  TextScramble,
  MorphingText,
  GlitchText,
  ShimmerText,
  SplitFlapDisplay,
  Odometer,
  AnimatedCounter,
  LiquidProgress,
  OrbitingIcons,
  Globe,
  BorderBeam,
  Sparkles,
  Meteors,
  RetroGrid,
  Spotlight,
  AuroraBackground,
  TiltCard,
  SpotlightCard,
  Marquee,
  FlipCard,
  CardStack,
  SwipeCards,
  ScratchCard,
  Confetti,
} from "../index";
import { Grid, Cell, Section } from "./_demo";

const meta: Meta = { title: "Galleries/Unique & Delight" };
export default meta;
type Story = StoryObj;

export const Buttons: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="MagneticButton">
        <MagneticButton>Hover near me</MagneticButton>
      </Cell>
      <Cell title="RippleButton">
        <RippleButton>Tap for ripple</RippleButton>
      </Cell>
      <Cell title="ShimmerButton">
        <ShimmerButton>Shimmer</ShimmerButton>
      </Cell>
      <Cell title="HoldToConfirm">
        <HoldToConfirm onConfirm={() => {}}>Hold to delete</HoldToConfirm>
      </Cell>
    </Grid>
  ),
};

export const Text: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="GradientText" minWidth={240}>
        <GradientText style={{ fontSize: 28 }}>Beautiful gradients</GradientText>
      </Cell>
      <Cell title="Typewriter" minWidth={240}>
        <span style={{ fontSize: 22 }}>
          <Typewriter words={["Build fast.", "Ship often.", "Stay cool."]} />
        </span>
      </Cell>
      <Cell title="TextScramble" minWidth={240}>
        <span style={{ fontSize: 22 }}>
          <TextScramble text="DECRYPTED" trigger="hover" />
        </span>
      </Cell>
      <Cell title="MorphingText" minWidth={240}>
        <MorphingText texts={["DESIGN", "SYSTEM", "MSR"]} />
      </Cell>
      <Cell title="GlitchText" minWidth={200}>
        <GlitchText text="GLITCH" style={{ fontSize: 28 }} />
      </Cell>
      <Cell title="ShimmerText" minWidth={200}>
        <ShimmerText style={{ fontSize: 28, fontWeight: 700 }}>Shiny text</ShimmerText>
      </Cell>
    </Grid>
  ),
};

export const Numbers: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="SplitFlapDisplay">
        <SplitFlapDisplay value="MSR 24" />
      </Cell>
      <Cell title="Odometer">
        <Odometer value={128450} />
      </Cell>
      <Cell title="AnimatedCounter">
        <AnimatedCounter value={9876} style={{ fontSize: 28, fontWeight: 700 }} />
      </Cell>
      <Cell title="LiquidProgress">
        <LiquidProgress value={68} />
      </Cell>
    </Grid>
  ),
};

export const Ambient: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="BorderBeam" minWidth={220}>
        <BorderBeam>
          <div style={{ padding: 20 }}>Animated border</div>
        </BorderBeam>
      </Cell>
      <Cell title="Sparkles" minWidth={220}>
        <Sparkles>
          <div style={{ padding: 20, fontSize: 22, fontWeight: 700 }}>Magic ✨</div>
        </Sparkles>
      </Cell>
      <Cell title="Meteors" minWidth={240}>
        <div style={{ position: "relative", height: 120, borderRadius: 12, overflow: "hidden", background: "var(--msr-color-surface-2)" }}>
          <Meteors count={14} />
        </div>
      </Cell>
      <Cell title="RetroGrid" minWidth={240}>
        <div style={{ position: "relative", height: 120, borderRadius: 12, overflow: "hidden", background: "var(--msr-color-surface)" }}>
          <RetroGrid />
        </div>
      </Cell>
      <Cell title="Spotlight" minWidth={240}>
        <Spotlight>
          <div style={{ padding: 28 }}>Move the cursor over me</div>
        </Spotlight>
      </Cell>
      <Cell title="AuroraBackground" minWidth={240}>
        <AuroraBackground style={{ height: 120, borderRadius: 12 }}>
          <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#fff", fontWeight: 700 }}>Aurora</div>
        </AuroraBackground>
      </Cell>
    </Grid>
  ),
};

export const Spatial: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="Globe">
        <Globe size={220} markers={[{ lat: 40.7, lng: -74, label: "NYC" }, { lat: 51.5, lng: -0.1, label: "LDN" }, { lat: 35.7, lng: 139.7, label: "TYO" }]} />
      </Cell>
      <Cell title="OrbitingIcons">
        <OrbitingIcons
          center={<div style={{ fontSize: 28 }}>🛰️</div>}
          items={[
            { id: "1", content: <span style={{ fontSize: 20 }}>⭐</span> },
            { id: "2", content: <span style={{ fontSize: 20 }}>🌙</span> },
            { id: "3", content: <span style={{ fontSize: 20 }}>☄️</span>, radius: 60, reverse: true },
          ]}
        />
      </Cell>
      <Cell title="TiltCard">
        <TiltCard>
          <div style={{ width: 180, height: 110, display: "grid", placeItems: "center", borderRadius: 12, background: "var(--msr-color-surface-2)" }}>Tilt me</div>
        </TiltCard>
      </Cell>
      <Cell title="SpotlightCard">
        <SpotlightCard>
          <div style={{ width: 180, height: 110, display: "grid", placeItems: "center" }}>Spotlight</div>
        </SpotlightCard>
      </Cell>
      <Cell title="FlipCard">
        <FlipCard front={<div style={{ display: "grid", placeItems: "center", height: 110 }}>Front</div>} back={<div style={{ display: "grid", placeItems: "center", height: 110 }}>Back</div>} height={110} />
      </Cell>
    </Grid>
  ),
};

function ConfettiDemo() {
  const [fire, setFire] = React.useState(0);
  return (
    <div style={{ position: "relative" }}>
      <RippleButton onClick={() => setFire((f) => f + 1)}>Celebrate 🎉</RippleButton>
      <Confetti fire={fire} />
    </div>
  );
}

export const Interactive: Story = {
  render: () => (
    <div>
      <Section title="Swipe & stack">
        <Grid gap={32}>
          <Cell title="SwipeCards" minWidth={300}>
            <SwipeCards
              labels={{ left: "Nope", right: "Like" }}
              cards={[
                { id: "1", content: <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 22 }}>Swipe me →</div> },
                { id: "2", content: <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 22 }}>Card two</div> },
                { id: "3", content: <div style={{ display: "grid", placeItems: "center", height: "100%", fontSize: 22 }}>Card three</div> },
              ]}
            />
          </Cell>
          <Cell title="CardStack" minWidth={340}>
            <CardStack
              cards={[
                { id: "1", content: <div>“msr-components is delightful.”</div> },
                { id: "2", content: <div>“Themes just work.”</div> },
                { id: "3", content: <div>“Zero dependencies, all vibes.”</div> },
              ]}
            />
          </Cell>
          <Cell title="ScratchCard" minWidth={300}>
            <ScratchCard>
              <div style={{ fontSize: 22, fontWeight: 700 }}>You won! 🎁</div>
            </ScratchCard>
          </Cell>
          <Cell title="Confetti">
            <ConfettiDemo />
          </Cell>
        </Grid>
      </Section>
      <Section title="Marquee">
        <Marquee>
          <span style={{ padding: "0 24px" }}>★ msr-components</span>
          <span style={{ padding: "0 24px" }}>★ 15 themes</span>
          <span style={{ padding: "0 24px" }}>★ dependency-free</span>
        </Marquee>
      </Section>
    </div>
  ),
};
