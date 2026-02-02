import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// ✅ Mantendo os ícones originais mapeados
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";

// ✅ Padrão SEM SSR para componentes pesados (Seu Trunfo)
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });

export default function AApplyToACommunity() {
  const router = useRouter();

  return (
    <div
      id="root"
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minHeight: "100vh",
        background: "#e7e6e2",
        fontFamily: '"Inter", sans-serif',
        overflowX: "hidden",
      }}
    >
      <Head>
        <title>Apply to a Community</title>
      </Head>

      {/* ✅ NÓ: topBar - Extraído do CSS Refinado */}
      <header
        id="topBar"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          background: "#ffffff",
          padding: "0 229px", // Valor exato do seu Docx
          borderBottom: "1px solid #d1d1d1",
          columnGap: "16px",
          height: "auto",
          minHeight: "64px",
        }}
      >
        <img
          id="img"
          src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
          style={{ width: "174px", height: "45px", objectFit: "cover" }}
        />

        {/* Grupo de Popovers (Links de Navegação) */}
        <div style={{ display: "flex", flexGrow: 1, justifyContent: "flex-end", gap: "20px", alignItems: "center" }}>
          <nav id="popover7" style={navItemStyle}>Service Dashboard</nav>
          <nav id="popover8" style={navItemStyle}>Community Dashboard</nav>
          <nav id="popover9" style={navItemStyle}>Market Trends</nav>
          <nav id="popover10" style={{ ...navItemStyle, fontWeight: 700 }}>Find a business</nav>
          
          <div id="popover26" style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
             <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "#d9d9d9" }} />
             <ChevronDownSvgIcon style={{ marginLeft: "8px", width: "12px" }} />
          </div>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main style={{ 
        padding: "48px 229px", 
        display: "grid", 
        gridTemplateColumns: "1fr 350px", 
        gap: "40px",
        maxWidth: "100%" 
      }}>
        
        {/* COLUNA DA ESQUERDA */}
        <section style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div id="youtubeVideo" style={{ borderRadius: "24px", overflow: "hidden", width: "100%", background: "#000" }}>
            <YouTube 
              videoId="" // ID dinâmico do seu backend
              opts={{ width: "100%", height: "450px" }} 
            />
          </div>

          <div id="container8" style={{ background: "#ffffff", padding: "40px", borderRadius: "24px" }}>
            <h1 id="about" style={{ fontSize: "32px", fontWeight: 700, marginBottom: "16px", color: "#000" }}>
              About this Community
            </h1>
            <div style={{ color: "#535353", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px" }}>
              {/* Slot para descrição */}
            </div>
            <a id="website" href="#" style={{ color: "#535353", textDecoration: "underline", fontSize: "14px" }}>
              Visit Website
            </a>
          </div>
        </section>

        {/* COLUNA DA DIREITA (Cards de Status) */}
        <aside id="container9" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          {/* ✅ NÓ: communityRate */}
          <div id="communityRate" style={{
            background: "linear-gradient(135deg, #000000 0%, #333333 100%)",
            borderRadius: "24px",
            padding: "32px",
            textAlign: "center",
            color: "#FFF"
          }}>
            <span style={{ fontSize: "14px", opacity: 0.8 }}>Community Rate</span>
            <div id="rateSum" style={{ fontSize: "40px", fontWeight: 800 }}>U$ 0.00</div>
          </div>

          {/* ✅ NÓ: goalsSum com o Gradiente do Docx */}
          <div id="goalsSum" className="freeBox___8RUhj" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
            borderRadius: "70px",
            padding: "24px",
            border: "4px solid #00000017",
            height: "150px"
          }}>
            <div style={{ fontSize: "24px", fontWeight: 700 }}>0/0</div>
            <span style={{ fontSize: "12px", color: "#535353" }}>Goals Reached</span>
          </div>

          <AntdButton 
            id="loginButton" // Mantendo referência de nó se houver
            type="primary" 
            block 
            style={{ 
              height: "56px", 
              borderRadius: "16px", 
              background: "#000", 
              fontSize: "16px", 
              fontWeight: 600 
            }}
          >
            Apply to join
          </AntdButton>
        </aside>
      </main>
    </div>
  );
}

const navItemStyle: React.CSSProperties = {
  fontSize: "14px",
  color: "#535353",
  cursor: "pointer",
  fontWeight: 400
};
