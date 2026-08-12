"use client";

import { useEffect, useState } from "react";
import { DevicesSection } from "@/app/connect/_components/devices-section";
import { PairingSection } from "@/app/connect/_components/pairing-section";
import { SetupSection } from "@/app/connect/_components/setup-section";
import type { TokenItem } from "@/app/connect/_components/types";

export function ConnectClient({ appBaseUrl }: { appBaseUrl: string }) {
  const [items, setItems] = useState<TokenItem[]>([]);
  const [name, setName] = useState("Browser utama");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    try {
      const response = await fetch("/api/integrations/tokens", {
        cache: "no-store",
      });
      const body = await response.json();
      if (response.ok && body.ok) setItems(body.data.items);
    } catch {
      setStatus("Daftar koneksi belum tersedia.");
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function create() {
    setStatus("Membuat token…");
    setToken(null);
    try {
      const response = await fetch("/api/integrations/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = await response.json();
      if (!response.ok || !body.ok) {
        throw new Error(body.error?.message ?? "Token belum dibuat.");
      }
      setToken(body.data.token);
      setStatus(
        "Token dibuat. Salin sekarang—nilai ini tidak ditampilkan lagi.",
      );
      await load();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Token belum dibuat.");
    }
  }

  async function revoke(id: string) {
    try {
      const response = await fetch("/api/integrations/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Gagal mencabut token");
      setStatus("Koneksi dicabut.");
      await load();
    } catch {
      setStatus("Koneksi belum dapat dicabut.");
    }
  }

  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Tersalin.");
    } catch {
      setStatus("Clipboard tidak tersedia.");
    }
  }

  return (
    <div className="grid gap-14">
      <PairingSection
        name={name}
        token={token}
        status={status}
        onNameChange={setName}
        onCreate={() => void create()}
        onCopy={(value) => void copy(value)}
      />
      <SetupSection
        appBaseUrl={appBaseUrl}
        onCopy={(value) => void copy(value)}
      />
      <DevicesSection items={items} onRevoke={(id) => void revoke(id)} />
    </div>
  );
}
