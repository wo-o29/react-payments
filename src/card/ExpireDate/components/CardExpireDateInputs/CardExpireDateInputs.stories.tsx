import type { Meta, StoryObj } from "@storybook/react";
import CardExpireDateInputs from "./CardExpireDateInputs";
import { INITIAL_EXPIRE_DATE_STATE } from "../../constants";
import { userEvent, expect, within } from "@storybook/test";
import useControlledExpireDate from "../../hooks/useControlledExpireDate";

const meta = {
  title: "Card/CardExpireDateInputs",
  component: CardExpireDateInputs,
  args: {
    expireDate: INITIAL_EXPIRE_DATE_STATE,
    expireDateInputRefs: { MM: { current: null }, YY: { current: null } },
    handleExpireMonthBlur: () => {},
    handleExpireChange: () => {},
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CardExpireDateInputs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {
  args: {
    expireDate: {
      ...INITIAL_EXPIRE_DATE_STATE,
      MM: { value: "13", errorMessage: "1 ~ 12월까지만 입력 가능합니다." },
    },
  },
};

export const WithValidationTest: Story = {
  render: () => {
    const {
      expireDate,
      expireDateInputRefs,
      handleExpireChange,
      handleExpireMonthBlur,
    } = useControlledExpireDate();

    return (
      <CardExpireDateInputs
        expireDate={expireDate}
        expireDateInputRefs={expireDateInputRefs}
        handleExpireChange={handleExpireChange}
        handleExpireMonthBlur={handleExpireMonthBlur}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const monthInput = canvas.getByPlaceholderText("MM") as HTMLInputElement;
    await userEvent.type(monthInput, "1");
    const yearInput = canvas.getByPlaceholderText("YY") as HTMLInputElement;
    await userEvent.type(yearInput, "2");

    const errorMessageEl = canvasElement.querySelector(
      "#YY-error-message"
    ) as HTMLSpanElement;

    expect(errorMessageEl.textContent).toBe("년도는 2자리만 입력 가능합니다.");
  },
};
