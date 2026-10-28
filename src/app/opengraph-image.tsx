import { ImageResponse } from "next/og";

export const alt = "prd.it - AI-Powered Product Engineering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #000000 0%, #1a1a2e 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              fontSize: "120px",
              fontWeight: "bold",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
            }}
          >
            prd
            <span style={{ color: "#3b82f6", margin: "0 8px" }}>.</span>
            it
          </div>
        </div>
        <div
          style={{
            fontSize: "40px",
            color: "#a0a0a0",
            textAlign: "center",
            maxWidth: "800px",
          }}
        >
          AI-Powered Product Engineering
        </div>
        <div
          style={{
            display: "flex",
            gap: "30px",
            marginTop: "60px",
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "2px solid rgba(59, 130, 246, 0.3)",
              borderRadius: "8px",
              color: "#60a5fa",
              fontSize: "24px",
            }}
          >
            Specifys AI
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(168, 85, 247, 0.1)",
              border: "2px solid rgba(168, 85, 247, 0.3)",
              borderRadius: "8px",
              color: "#c084fc",
              fontSize: "24px",
            }}
          >
            Rift Code
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(16, 185, 129, 0.1)",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              color: "#34d399",
              fontSize: "24px",
            }}
          >
            GreenPRD
          </div>
          <div
            style={{
              padding: "12px 24px",
              background: "rgba(249, 115, 22, 0.1)",
              border: "2px solid rgba(249, 115, 22, 0.3)",
              borderRadius: "8px",
              color: "#fb923c",
              fontSize: "24px",
            }}
          >
            AdPulse
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
