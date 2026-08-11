// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RespondClient } from "@/app/respond/respond-client";

describe("RespondClient", () => {
  it("supports multiple selections and resets the complete triage", () => {
    render(<RespondClient />);

    const transfer = screen.getByRole("button", { name: /Uang sudah terkirim/i });
    const credential = screen.getByRole("button", { name: /OTP, PIN, password/i });
    fireEvent.click(transfer);
    fireEvent.click(credential);

    expect(transfer).toHaveAttribute("aria-pressed", "true");
    expect(credential).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /Hubungi bank atau e-wallet sekarang/i })).toBeVisible();
    expect(screen.getByText(/Rencana diperbarui/i)).toHaveTextContent("6 langkah perlu dilakukan sekarang");

    fireEvent.click(screen.getByRole("button", { name: /Ulangi pilihan/i }));

    expect(transfer).toHaveAttribute("aria-pressed", "false");
    expect(credential).toHaveAttribute("aria-pressed", "false");
    expect(screen.queryByRole("heading", { name: /Hubungi bank atau e-wallet sekarang/i })).not.toBeInTheDocument();
  });

  it("uses the affected service to replace a generic recovery action", () => {
    render(<RespondClient />);

    fireEvent.click(screen.getByRole("button", { name: /Akun atau nomor HP sudah diambil alih/i }));
    expect(screen.getByRole("heading", { name: /Amankan akun yang paling penting/i })).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Nomor HP atau SIM/i }));
    expect(screen.getByRole("heading", { name: /Hubungi operator seluler/i })).toBeVisible();
    expect(screen.queryByRole("heading", { name: /Amankan akun yang paling penting/i })).not.toBeInTheDocument();
  });
});
