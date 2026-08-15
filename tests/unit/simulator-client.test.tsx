import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SimulatorClient } from "@/app/simulator/_components/simulator-client";

describe("SimulatorClient", () => {
  it("shows explanatory feedback immediately before moving to the next decision", () => {
    render(<SimulatorClient />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Percaya karena suara dan fotonya cocok/i,
      }),
    );

    const feedbackHeading = screen.getByRole("heading", {
      name: /Kenapa keputusan ini dinilai begitu/i,
    });
    expect(feedbackHeading).toHaveFocus();
    expect(screen.getByText(/^Berisiko · 0\/100$/i)).toBeVisible();
    expect(screen.getByText(/Suara dan gambar dapat ditiru/i)).toBeVisible();
    expect(
      screen.getByRole("button", { name: /Lanjut ke keputusan berikutnya/i }),
    ).toBeVisible();
  });

  it("completes a mixed path and exposes the transferable rule", () => {
    render(<SimulatorClient />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Percaya karena suara dan fotonya cocok/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Lanjut ke keputusan berikutnya/i }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Tunda dan cek melalui grup keluarga/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Lanjut ke keputusan berikutnya/i }),
    );
    fireEvent.click(
      screen.getByRole("button", {
        name: /Berhenti sampai orangnya bisa dikonfirmasi/i,
      }),
    );
    fireEvent.click(
      screen.getByRole("button", { name: /Lihat hasil latihan/i }),
    );

    expect(screen.getByText(/^67$/)).toBeVisible();
    expect(
      screen.getByRole("heading", {
        name: /Suara, foto, dan jawaban di chat bukan verifikasi/i,
      }),
    ).toBeVisible();
    expect(screen.getByText(/2 aman · 0 belum cukup · 1 berisiko/i))
      .toBeVisible();
  });

  it("switches scenarios and clears in-progress feedback", () => {
    render(<SimulatorClient />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Percaya karena suara dan fotonya cocok/i,
      }),
    );
    expect(screen.getByText(/^Berisiko · 0\/100$/i)).toBeVisible();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Telepon CS, ancaman akun, dan OTP/i,
      }),
    );
    expect(
      screen.getByRole("heading", {
        name: /Telepon CS, ancaman akun, dan OTP/i,
      }),
    ).toBeVisible();
    expect(screen.queryByText(/^Berisiko · 0\/100$/i)).not.toBeInTheDocument();
    expect(screen.getByRole("progressbar", { name: /Kemajuan skenario/i }))
      .toHaveAttribute("aria-valuenow", "0");
  });
});
