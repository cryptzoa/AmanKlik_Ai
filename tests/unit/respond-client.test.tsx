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

  it("only shows relevant services and clears a stale selection", () => {
    render(<RespondClient />);

    const transfer = screen.getByRole("button", { name: /Uang sudah terkirim/i });
    const takeover = screen.getByRole("button", { name: /Akun atau nomor HP sudah diambil alih/i });

    fireEvent.click(transfer);
    expect(screen.getByRole("button", { name: /Bank, kartu, atau e-wallet/i })).toBeVisible();
    expect(screen.getByRole("button", { name: /Marketplace/i })).toBeVisible();
    expect(screen.queryByRole("button", { name: /Email utama/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /WhatsApp/i })).not.toBeInTheDocument();

    fireEvent.click(takeover);
    const email = screen.getByRole("button", { name: /Email utama/i });
    fireEvent.click(email);
    expect(email).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(takeover);
    expect(screen.queryByRole("button", { name: /Email utama/i })).not.toBeInTheDocument();

    fireEvent.click(takeover);
    expect(screen.getByRole("button", { name: /Email utama/i })).toHaveAttribute("aria-pressed", "false");
  });
});
