import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// ✅ Ícones mantidos do asset original
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";

// ✅ Padrão de importação dinâmica para componentes UI
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdTooltip = dynamic(() => import("antd").then((mod) => mod.Tooltip), { ssr: false });
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

export default function AApplyToACommunity() {
  const router = useRouter();

  // Estados para simular a lógica de nós que o Plasmic gera
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div
      id="root"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        background: "#e7e6e2", // Cor extraída do .root do seu CSS
        fontFamily: "Inter, sans-serif",
      }}
    >
      <Head>
        <title>Apply to a Community</title>
      </Head>

      {/* ✅ NÓ: topBar (Recriado com as medidas do seu CSS) */}
      <header
        id="topBar"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: "80px",
          background: "#ffffff",
          padding: "0 50px",
          borderBottom: "1px solid #d1d1d1",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <img
          id="img"
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          alt="Logo"
          style={{ height: "40px", objectFit: "contain" }}
        />

        <div style={{ display: "flex", gap: "25px", alignItems: "center" }}>
          <NavLink href="/find-a-business">Find a business</NavLink>
          <NavLink href="/dashboard">Dashboard</NavLink>
          
          {/* ✅ NÓ: popover26 (Menu do Usuário) */}
          <div id="popover26" style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#ccc" }} />
            <ChevronDownSvgIcon width={12} height={12} />
          </div>
        </div>
      </header>

      <main style={{ padding: "40px 10% 80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        
        {/* ✅ NÓ: youtubeVideo */}
        <section
          id="youtubeVideo"
          style={{
            width: "100%",
            maxWidth: "900px",
            aspectRatio: "16/9",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            marginBottom: "40px"
          }}
        >
          <YouTube
            videoId="dQw4w9WgXcQ" // Placeholder - o ID viria do seu backend
            opts={{ width: "100%", height: "100%", playerVars: { autoplay: 0 } }}
            style={{ width: "100%", height: "100%" }}
          />
        </section>

        {/* ✅ NÓS DE INFORMAÇÃO: about e website */}
        <div style={{ width: "100%", maxWidth: "900px", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
          
          <div id="container8" style={{ background: "#fff", padding: "30px", borderRadius: "20px" }}>
            <h1 id="about" style={{ fontSize: "24px", fontWeight: 700, marginBottom: "15px" }}>
              About this Community
            </h1>
            <p style={{ color: "#535353", lineHeight: 1.6 }}>
              {/* O conteúdo aqui seria dinâmico baseado no backend */}
              This community is focused on high-performance marketing and growth hacking.
            </p>
            <a id="website" href="#" style={{ color: "#0070f3", marginTop: "15px", display: "block" }}>
              Visit Website
            </a>
          </div>

          <div id="container9" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* ✅ NÓ: communityRate */}
            <div
              id="communityRate"
              style={{
                background: "linear-gradient(135deg, #6e8efb, #a777e3)",
                padding: "20px",
                borderRadius: "20px",
                color: "#fff",
                textAlign: "center"
              }}
            >
              <div id="rateSum" style={{ fontSize: "32px", fontWeight: 800 }}>U$ 500</div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>Community Rate</div>
            </div>

            {/* ✅ NÓ: goalsSum */}
            <div
              id="goalsSum"
              style={{
                background: "#fff",
                padding: "20px",
                borderRadius: "20px",
                border: "2px solid #00000017",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "24px", fontWeight: 700 }}>12/20</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Goals Reached</div>
            </div>

            <AntdButton
              type="primary"
              style={{ height: "50px", borderRadius: "12px", fontWeight: 600, background: "#000" }}
              onClick={() => console.log("Applied!")}
            >
              Apply Now
            </AntdButton>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ===== SUB-COMPONENTES HELPER ===== */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} style={{ textDecoration: "none", color: "#535353", fontSize: "14px", fontWeight: 500 }}>
      {children}
    </Link>
  );
}
