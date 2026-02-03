import * as React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

// ================= UI COMPONENTS =================

const AntdButton = dynamic(
  () => import("antd").then((mod) => mod.Button),
  { ssr: false }
);

const AntdInput = dynamic(
  () => import("antd").then((mod) => mod.Input),
  { ssr: false }
);

const AntdRate = dynamic(
  () => import("antd").then((mod) => mod.Rate),
  { ssr: false }
);

const { TextArea } = AntdInput;

// ================= STYLES =================

const STYLES = {
  pageBg: "#e7e6e2",
  text: "#535353",
  white: "#ffffff",
  border: "#00000017",
  fontFamily: '"Inter", sans-serif',
  accent: "#228b22",
  cardGradient:
    "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
};

// ================= PAGE =================

export default function ApplyCommunityPage() {
  return (
    <div
      style={{
        backgroundColor: STYLES.pageBg,
        minHeight: "100vh",
        fontFamily: STYLES.fontFamily,
        color: STYLES.text,
      }}
    >
      <Head>
        <title>Apply to Community</title>
      </Head>

      {/* ================= TOP BAR ================= */}
      {/* -account [dropdown] */}
      <nav
        style={{
          background: STYLES.white,
          borderBottom: `1px solid ${STYLES.border}`,
          display: "flex",
          justifyContent: "center",
          padding: "12px 0",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1064px", // DESIGN FIX
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <img
            src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
            style={{ height: 35 }}
          />

          {/* -sign_out [action] */}
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Sign out
          </div>
        </div>
      </nav>

      {/* ================= MAIN GRID ================= */}
      <main
        style={{
          maxWidth: "1064px", // DESIGN FIX
          margin: "40px auto",
          padding: "0 20px",
          display: "grid",
          gridTemplateColumns: "1fr 340px", // subtle balance fix
          gap: "40px",
        }}
      >
        {/* ================= LEFT COLUMN ================= */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          {/* -------- Container 3 : Community Header -------- */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            {/* -community_logo [img] */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: 15,
                background: "#ccc",
                overflow: "hidden",
              }}
            >
              <img
                src="https://picsum.photos/seed/community/200/200"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div>
              {/* -type [text] */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: STYLES.accent,
                }}
              >
                Professional
              </span>

              {/* -community_name [text] */}
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 800,
                  margin: 0,
                }}
              >
                Global Entrepreneurship Network
              </h1>
            </div>
          </div>

          {/* -------- Members Section -------- */}
          <div>
            {/* -members_title [text] */}
            <h3>Our Members</h3>

            {/* -members_slider [slider_carousel] */}
            <div
              style={{
                display: "flex",
                gap: "16px",
              }}
            >
              {/* ¨¨member [horizontal_stack] */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* -profile_pic [img] */}
                <img
                  src="https://picsum.photos/seed/member/40/40"
                  style={{ borderRadius: "50%" }}
                />

                {/* -office [text] */}
                <span>Founder</span>
              </div>
            </div>
          </div>

          {/* -------- Container 8 : Introduction -------- */}
          <div
            style={{
              background: STYLES.white,
              padding: "30px",
              borderRadius: "25px",
              border: `1px solid ${STYLES.border}`,
            }}
          >
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>
              Introduction
            </h3>

            {/* -youtube_video [youtube] */}
            <div
              style={{
                position: "relative",
                paddingBottom: "52%", // slightly smaller video
                height: 0,
                overflow: "hidden",
                borderRadius: "15px",
                background: "#000",
              }}
            >
              <iframe
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>

            <div style={{ marginTop: 25 }}>
              {/* -about [text] */}
              <p
                style={{
                  fontSize: 15,
                  lineHeight: "1.6",
                }}
              >
                Official community description provided by the
                organization.
              </p>

              {/* -website [link] */}
              <a
                href="#"
                style={{
                  color: STYLES.accent,
                  fontWeight: 600,
                }}
              >
                Visit website
              </a>
            </div>
          </div>
        </section>

        {/* ================= RIGHT COLUMN ================= */}
        <aside
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "25px",
          }}
        >
          {/* -------- Container 2 : Application -------- */}
          <div
            style={{
              background: STYLES.white,
              padding: "30px",
              borderRadius: "25px",
              border: `1px solid ${STYLES.border}`,
            }}
          >
            <h4
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 15,
              }}
            >
              Send application
            </h4>

            {/* -short_message [textarea] */}
            <TextArea
              rows={5}
              placeholder="Why do you want to join this community?"
              style={{
                borderRadius: "12px",
                padding: "12px",
                marginBottom: "20px",
              }}
            />

            {/* -invite_button [login_button] */}
            <AntdButton
              type="primary"
              block
              style={{
                background: STYLES.accent,
                borderColor: STYLES.accent,
                height: 50,
                borderRadius: "12px",
                fontWeight: 600,
              }}
            >
              Send application
            </AntdButton>
          </div>

          {/* -------- Container 9 : Rating -------- */}
          <div
            style={{
              background: STYLES.white,
              padding: "20px",
              borderRadius: "25px",
              textAlign: "center",
              border: `1px solid ${STYLES.border}`,
            }}
          >
            {/* -community_rate [rate] */}
            <AntdRate disabled defaultValue={4.8} />

            {/* -rate_sum [text] */}
            <div style={{ marginTop: 8, fontSize: 12 }}>
              4.8 (120 reviews)
            </div>

            {/* -goals_sum [text] */}
            <div
              style={{
                marginTop: 16,
                fontSize: 22,
                fontWeight: 800,
                color: STYLES.accent,
              }}
            >
              850+
            </div>
          </div>

          {/* -------- Container 10 : Connected Companies -------- */}
          <div>
            {/* -connected_companies_title [text] */}
            <h4>Connected Companies</h4>

            {/* -connected_companies_slider [slider_carousel] */}
            <div
              style={{
                display: "flex",
                gap: "12px",
              }}
            >
              {/* ¨¨connected_company [button] */}
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {/* -company_logo [img] */}
                <img
                  src="https://picsum.photos/seed/company/40/40"
                />

                {/* -company_name [text] */}
                Company Name
              </button>
            </div>
          </div>

          {/* -------- Container 11 -------- */}
          {/* structural container / spacer */}
        </aside>
      </main>
    </div>
  );
}
