"use client";

import { useCallback, useEffect, useState } from "react";
import { DevicesSection } from "@/app/connect/_components/devices-section";
import { PairingSection } from "@/app/connect/_components/pairing-section";
import { SetupSection } from "@/app/connect/_components/setup-section";
import type { TokenItem } from "@/app/connect/_components/types";

type ListState = "loading" | "loaded" | "unavailable";
type UiStatus = { message: string; isError: boolean };
type TokenApiEnvelope = {
  ok?: boolean;
  data?: { items?: TokenItem[]; token?: string };
  error?: { message?: string };
};

async function readTokenEnvelope(response: Response): Promise<TokenApiEnvelope> {
  try {
    return await response.json() as TokenApiEnvelope;
  } catch {
    return {};
  }
}

function requestFailureMessage(error: unknown, fallback: string): string {
  if (!navigator.onLine || error instanceof TypeError) {
    return "Jaringan belum dapat menjangkau AmanKlik. Coba lagi setelah koneksi stabil.";
  }
  return error instanceof Error ? error.message : fallback;
}

export function ConnectClient({ appBaseUrl }: { appBaseUrl: string }) {
  const [items, setItems] = useState<TokenItem[]>([]);
  const [listState, setListState] = useState<ListState>("loading");
  const [name, setName] = useState("Browser utama");
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<UiStatus | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [revokePendingId, setRevokePendingId] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    try {
      const response = await fetch("/api/integrations/tokens", {
        cache: "no-store",
        signal,
      });
      const body = await readTokenEnvelope(response);
      if (!response.ok || !body.ok || !Array.isArray(body.data?.items)) {
        throw new Error(body.error?.message ?? "Daftar koneksi belum tersedia.");
      }
      setItems(body.data.items);
      setListState("loaded");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setListState("unavailable");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timer = window.setTimeout(() => void load(controller.signal), 0);
    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [load]);

  async function create() {
    if (createPending || name.trim().length < 3 || name.trim().length > 60) {
      return;
    }

    setCreatePending(true);
    setStatus(null);
    setToken(null);
    try {
      const response = await fetch("/api/integrations/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const body = await readTokenEnvelope(response);
      if (
        !response.ok ||
        !body.ok ||
        typeof body.data?.token !== "string"
      ) {
        throw new Error(body.error?.message ?? "Kode akses belum dibuat.");
      }
      setToken(body.data.token);
      setStatus({
        message: "Kode akses dibuat. Salin sebelum menutup tampilan ini.",
        isError: false,
      });
      await load();
    } catch (error) {
      setStatus({
        message: requestFailureMessage(error, "Kode akses belum dibuat."),
        isError: true,
      });
    } finally {
      setCreatePending(false);
    }
  }

  async function revoke(id: string, nameLabel: string) {
    if (revokePendingId) return;
    setRevokePendingId(id);
    setStatus(null);
    try {
      const response = await fetch("/api/integrations/tokens", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const body = await readTokenEnvelope(response);
      if (!response.ok || !body.ok) {
        throw new Error(body.error?.message ?? "Koneksi belum dapat dicabut.");
      }
      setStatus({
        message: `Akses untuk ${nameLabel} sudah dicabut.`,
        isError: false,
      });
      await load();
    } catch (error) {
      setStatus({
        message: requestFailureMessage(
          error,
          "Koneksi belum dapat dicabut.",
        ),
        isError: true,
      });
    } finally {
      setRevokePendingId(null);
    }
  }

  async function copy(value: string, label: "token" | "alamat") {
    try {
      if (!navigator.clipboard) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(value);
      setStatus({
        message: label === "token"
          ? "Kode akses tersalin."
          : "Alamat server tersalin.",
        isError: false,
      });
    } catch {
      setStatus({ message: "Fitur salin tidak tersedia.", isError: true });
    }
  }

  return (
    <div className="grid gap-14">
      <PairingSection
        name={name}
        token={token}
        status={status}
        createPending={createPending}
        onNameChange={(value) => {
          setName(value);
          setStatus(null);
        }}
        onCreate={() => void create()}
        onCopy={(value) => void copy(value, "token")}
        onDismissToken={() => {
          setToken(null);
          setStatus({
            message: "Tampilan kode akses sudah ditutup.",
            isError: false,
          });
        }}
      />
      <SetupSection
        appBaseUrl={appBaseUrl}
        onCopy={(value) => void copy(value, "alamat")}
      />
      <DevicesSection
        items={items}
        listState={listState}
        revokePendingId={revokePendingId}
        onRetry={() => {
          setListState("loading");
          void load();
        }}
        onRevoke={(id, nameLabel) => void revoke(id, nameLabel)}
      />
    </div>
  );
}
