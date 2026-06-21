import type { Meta, StoryObj } from "@storybook/react";
import { PricingTable, ProductCard, CartLineItem, CheckoutSummary, CouponInput, PaymentMethodCard } from "../index";
import { Grid, Cell } from "./_demo";

const meta: Meta = { title: "Galleries/Commerce" };
export default meta;
type Story = StoryObj;

export const Pricing: Story = {
  render: () => (
    <PricingTable
      currentPlanId="starter"
      plans={[
        { id: "starter", name: "Starter", price: "$0", period: "/mo", features: ["1 project", "Community support"] },
        { id: "pro", name: "Pro", price: "$12", period: "/mo", highlighted: true, badge: "Popular", features: ["Unlimited projects", { text: "Priority support" }, { text: "SSO", included: false }] },
        { id: "team", name: "Team", price: "$29", period: "/mo", features: ["Everything in Pro", "Audit log", "SAML"] },
      ]}
    />
  ),
};

export const ProductAndCart: Story = {
  render: () => (
    <Grid gap={32}>
      <Cell title="ProductCard" minWidth={260}>
        <ProductCard
          title="Aurora Headphones"
          subtitle="Audio"
          price="$199"
          originalPrice="$249"
          badge="Sale"
          rating={4}
          reviewCount={128}
          image="https://picsum.photos/id/1080/400/300"
        />
      </Cell>
      <Cell title="CartLineItem" minWidth={420}>
        <CartLineItem title="Aurora Headphones" variant="Black" price={199} quantity={1} image="https://picsum.photos/id/1080/120/120" onQuantityChange={() => {}} onRemove={() => {}} />
      </Cell>
      <Cell title="CheckoutSummary" minWidth={320}>
        <CheckoutSummary
          subtotal={199}
          lines={[
            { label: "Shipping", value: 9 },
            { label: "Discount", value: -20, tone: "discount" },
          ]}
        />
      </Cell>
    </Grid>
  ),
};

export const Payment: Story = {
  render: () => (
    <Grid gap={24}>
      <Cell title="CouponInput" minWidth={300}>
        <CouponInput onApply={(c) => c === "SAVE20"} />
      </Cell>
      <Cell title="PaymentMethodCard" minWidth={320}>
        <PaymentMethodCard brand="visa" last4="4242" expiry="08/27" isDefault />
      </Cell>
      <Cell title="Selectable" minWidth={320}>
        <PaymentMethodCard brand="mastercard" last4="5555" expiry="01/26" selectable selected />
      </Cell>
    </Grid>
  ),
};
