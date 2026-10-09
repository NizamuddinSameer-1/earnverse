import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getCurrentUser } from "@/lib/auth";

interface RouteParams {
  params: Promise<{
    network: string;
  }>;
}

/**
 * GET /api/offers/launch/[network]
 * Generates secure, signed launch URLs for integrated offerwalls (BitLabs, CPX Research)
 * protecting publisher secret keys on the server and binding the user session.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { network: rawNetwork } = await params;
    const network = rawNetwork.toLowerCase();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "Authentication required. Please log in to launch offerwalls and earn coins.",
        },
        { status: 401 }
      );
    }

    if (network === "bitlabs") {
      const appToken =
        process.env.BITLABS_APP_TOKEN || "168071d5-739e-407b-9ded-48584123fdd8";

      // BitLabs Web Offerwall URL
      // Documentation: https://web.bitlabs.ai/?token={APP_TOKEN}&uid={USER_ID}
      const launchUrl = `https://web.bitlabs.ai/?token=${encodeURIComponent(
        appToken
      )}&uid=${encodeURIComponent(user.id)}`;

      return NextResponse.json({
        success: true,
        network: "BITLABS",
        name: "BitLabs Surveys & Offers",
        userId: user.id,
        username: user.username,
        launchUrl,
        mode: "iframe",
      });
    }

    if (network === "cpx" || network === "cpx-research") {
      const appId = process.env.CPX_APP_ID || "";
      const secureHashSecret =
        process.env.CPX_SECURE_HASH ||
        process.env.CPX_SECRET_KEY ||
        "RDYDzWTjF2m5KIteuIoiazppSVMxClSR";

      // CPX Research Secure Hash: md5(ext_user_id + '-' + secure_hash)
      const secureHash = crypto
        .createHash("md5")
        .update(`${user.id}-${secureHashSecret}`)
        .digest("hex");

      const launchUrl = appId
        ? `https://offers.cpx-research.com/index.php?app_id=${encodeURIComponent(
            appId
          )}&ext_user_id=${encodeURIComponent(
            user.id
          )}&secure_hash=${secureHash}&subid_1=earnverse`
        : `https://offers.cpx-research.com/index.php?ext_user_id=${encodeURIComponent(
            user.id
          )}&secure_hash=${secureHash}&subid_1=earnverse`;

      return NextResponse.json({
        success: true,
        network: "CPX",
        name: "CPX Research Surveys",
        userId: user.id,
        username: user.username,
        configured: Boolean(appId),
        missingConfigNotice: !appId
          ? "CPX_APP_ID is pending in .env. Enter your numeric App ID from your CPX publisher dashboard."
          : undefined,
        launchUrl,
        mode: "iframe",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: `Network '${rawNetwork}' not supported or pending publisher keys.`,
      },
      { status: 404 }
    );
  } catch (error: unknown) {
    console.error("Offerwall launch error:", error);
    const msg = error instanceof Error ? error.message : "Internal launch error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
