import { afterEach, describe, expect, it, vi } from "vitest";
import { DatabaseError } from "@/lib/errors";
import { reportServerError } from "@/server/observability/report-error";

describe("reportServerError", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("records recovered retryable failures as warnings", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    reportServerError("investigation.list", new DatabaseError("private detail"));

    expect(error).not.toHaveBeenCalled();
    expect(warn).toHaveBeenCalledOnce();
    const record = JSON.parse(warn.mock.calls[0]?.[0] ?? "{}") as {
      level?: string;
      context?: string;
      code?: string;
      retryable?: boolean;
      message?: string;
    };
    expect(record).toMatchObject({
      level: "warning",
      context: "investigation.list",
      code: "INTERNAL_ERROR",
      retryable: true,
    });
    expect(record).not.toHaveProperty("message");
  });

  it("keeps unexpected failures on the error channel", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const error = vi.spyOn(console, "error").mockImplementation(() => {});

    const failure = Object.assign(new Error("private detail"), {
      code: "ECONNRESET",
    });
    reportServerError("unexpected", failure);

    expect(warn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledOnce();
    expect(JSON.parse(error.mock.calls[0]?.[0] ?? "{}")).toMatchObject({
      level: "error",
      context: "unexpected",
      code: "UNEXPECTED_ERROR",
      causeCode: "ECONNRESET",
      retryable: false,
    });
    expect(JSON.stringify(error.mock.calls[0]?.[0] ?? "")).not.toContain(
      "private detail",
    );
  });
});
