import { NextRequest, NextResponse } from "next/server";
import { normalizePostbackData, processOfferwallPostback } from "@/lib/postbacks";

interface RouteParams {
  params: Promise<{
    network: string;
  }>;
}

/**
 * GET Handler for Offerwall Webhooks (BitLabs, CPX Research, Torox).
 * Many networks send postbacks via HTTP GET with query parameters.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { network } = await params;
    const searchParams = request.nextUrl.searchParams;
    const rawParams: Record<string, unknown> = {};

    searchParams.forEach((val, key) => {
      rawParams[key] = val;
    });

    const normalized = normalizePostbackData(network, rawParams);
    const result = await processOfferwallPostback(normalized);

    // Some networks require a literal "1" or "OK" response
    const format = searchParams.get("format");
    if (format === "text") {
      return new NextResponse(result.success ? "1" : "0", {
        status: result.success ? 200 : 400,
        headers: { "Content-Type": "text/plain" },
      });
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: unknown) {
    console.error("GET webhook error:", error);
    const msg = error instanceof Error ? error.message : "Internal postback error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST Handler for Offerwall Webhooks.
 * Used by modern networks and the Admin Simulator to post JSON or form payloads.
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { network } = await params;
    let rawParams: Record<string, unknown> = {};

    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        rawParams = await request.json();
      } catch (_) {
        rawParams = {};
      }
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((val, key) => {
        rawParams[key] = val;
      });
    }

    // Merge search params if query params exist alongside POST
    request.nextUrl.searchParams.forEach((val, key) => {
      if (!(key in rawParams)) {
        rawParams[key] = val;
      }
    });

    const normalized = normalizePostbackData(network, rawParams);
    const result = await processOfferwallPostback(normalized);

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error: unknown) {
    console.error("POST webhook error:", error);
    const msg = error instanceof Error ? error.message : "Internal postback error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
