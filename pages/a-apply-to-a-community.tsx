/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

/**
 * COMPONENTES DE UI COM CORREÇÃO DE BUILD
 * O TextArea é importado isoladamente para evitar o erro de propriedade inexistente no Vercel.
 */
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });
const AntdTooltip = dynamic(() => import("antd").then((mod) => mod.Tooltip), { ssr: false });

/**
 * SISTEMA DE ESTILOS EXTRAÍDO DO SEU .CSS
 * Mantendo a grid de 1064px centralizada e as variáveis de cor.
 */
const CSS = {
  root: {
    display: "grid",
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    alignContent: "flex-start",
    justifyItems: "center",
    background: "#e7e6e2",
    overflow: "auto",
    fontFamily: '"Inter", sans-serif',
    // Grid complexa para travar o conteúdo no centro (1064px)
    gridTemplateColumns: "1fr minmax(0, 1064px) 1fr",
  },
  topBar: {
    gridColumn: "1 / -1",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    background: "#ffffff",
    padding: "0px 24px",
    height: "80px",
    borderBottom: "1px solid #00000017",
    zIndex: 1000,
  },
  contentWrapper: {
    gridColumn: "2",
    display: "flex",
    flexDirection: "row",
    width: "100%",
    maxWidth: "1064px",
    padding: "48px 0px",
    gap: "32px",
    alignItems: "flex-start",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    flex: "1",
    gap: "32px",
    minWidth: 0,
  },
  rightColumn: {
    display: "flex",
    flexDirection: "column",
    width: "360px",
    gap: "24px",
    flexShrink: 0,
  },
  // Estilo dos Containers (Cards)
  cardBase: {
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
    borderRadius: "28px",
    padding: "40px",
    border: "1px solid #00000017",
    width: "100%",
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  // Estilo específico do Goals Sum (Nó com gradiente)
  goalsCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
    borderRadius: "80px",
    padding: "40px",
    border: "4px solid #00000017",
    textAlign: "center",
  },
  videoFrame: {
    position: "relative",
    width: "100%",
    paddingBottom: "56.25%", // 16:9
    height: 0,
    borderRadius: "24px",
    overflow: "hidden",
    background: "#000",
    marginTop: "24px",
  }
};

export default function PlasmicAApplyToACommunity() {
  const router = useRouter();

  // Mapeamento dos nós para consulta visual (Sem Supabase instalado)
  const nodes = {
    topBar: { account: "Sign out" },
    container3: {
      community_logo: null,
      type: "Professional Agency",
      community_name: "Ez Marketing Agencies 2"
    },
    container8: {
      youtube_video: "dQw4w9WgXcQ", // Exemplo de ID
      about: "About text from Community table...",
      website: "https://ezmarketing.space"
    },
    container2: {
      short_message: "",
      invite_button: "SEND INVITE"
    },
    container9: {
      community_rate: 4.8,
      rate_sum: "128 Agency Reviews"
    },
    goalsSum: "850+"
  };

  return (
    <div className="root" style={CSS.root}>
      <Head>
        <title>Apply to a Community | Ez Marketing</title>
      </Head>

      {/* --- NÓ: Top bar --- */}
      <nav className="topBar" style={CSS.topBar}>
        <div style={{ width: "1064px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: "45px" }} alt="Logo" />
          
          {/* NÓ: -Account [dropdown] */}
          <div className="account" style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
             <span style={{ fontWeight: 700, fontSize: "14px", color: "#535353" }}>{nodes.topBar.account}</span>
             <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#eee" }} />
          </div>
        </div>
      </nav>

      {/* --- WRAPPER CENTRALIZADO (1064px) --- */}
      <div className="contentWrapper" style={CSS.contentWrapper}>
        
        {/* --- COLUNA ESQUERDA --- */}
        <main className="leftColumn" style={CSS.leftColumn}>
          
          {/* NÓ: Container 3 (Header da Agência) */}
          <section className="container3" style={{ display: "flex", alignItems: "center", gap: "32px" }}>
            <div className="communityLogo" style={{ 
              width: "140px", height: "140px", background: "#fff", 
              borderRadius: "32px", border: "1px solid #00000017", padding: "12px" 
            }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "20px", background: "#f5f5f5" }} />
            </div>
            
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span className="type" style={{ color: "#228b22", fontWeight: 800, fontSize: "13px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                {nodes.container3.type}
              </span>
              <h1 className="communityName" style={{ fontSize: "42px", fontWeight: 900, margin: "8px 0", letterSpacing: "-2px", color: "#1a1a1a" }}>
                {nodes.container3.community_name}
              </h1>
            </div>
          </section>

          {/* NÓ: Container 8 (Vídeo e Descrição) */}
          <section className="container8" style={CSS.cardBase}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "20px", fontWeight: 800 }}>Introduction</h2>
              <div style={{ padding: "8px 16px", borderRadius: "20px", background: "#f0fdf4", color: "#228b22", fontSize: "12px", fontWeight: 700 }}>
                ACTIVE AGENCY
              </div>
            </div>

            {/* NÓ: -youtube_video */}
            <div className="youtubeVideo" style={CSS.videoFrame}>
              <iframe 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src={`https://www.youtube.com/embed/${nodes.container8.youtube_video}`}
                frameBorder="0" allowFullScreen 
              />
            </div>

            {/* NÓ: Container 11 (Descrição e Link) */}
            <div className="container11" style={{ marginTop: "40px", display: "flex", flexDirection: "column", gap: "16px" }}>
               <p className="about" style={{ fontSize: "16px", lineHeight: "1.8", color: "#535353", fontWeight: 400 }}>
                  {nodes.container8.about}
               </p>
               <a className="website" href={nodes.container8.website} style={{ color: "#228b22", fontWeight: 800, textDecoration: "underline", fontSize: "15px" }}>
                  Visit official website
               </a>
            </div>
          </section>

          {/* NÓ: ¨¨member [repetitive stack] (Slider Carousel) */}
          <section className="sliderCarousel" style={{ display: "flex", gap: "20px", overflowX: "auto", paddingBottom: "20px" }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="member" style={{ 
                minWidth: "160px", height: "130px", background: "#fff", 
                borderRadius: "80px", border: "4px solid #00000017",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {/* NÓ: -Profile pic */}
                <div style={{ width: "55px", height: "55px", borderRadius: "50%", background: "#eee", marginBottom: "10px", border: "2px solid #fff" }} />
                {/* NÓ: -Office */}
                <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", color: "#888" }}>Management</span>
              </div>
            ))}
          </section>

          {/* ESPAÇO PARA OS 26 POPOVERS MENCIONADOS (Estrutura de Mapeamento) */}
          <div className="popover-grid" style={{ display: "none" }}>
            {/* Aqui entrariam os componentes popover1 a popover26 se fossem renderizados simultaneamente */}
          </div>
        </main>

        {/* --- COLUNA DIREITA (Sidebar) --- */}
        <aside className="rightColumn" style={CSS.rightColumn}>
          
          {/* NÓ: Container 2 (Aplicação) */}
          <div className="container2" style={CSS.cardBase}>
            <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "20px", color: "#1a1a1a" }}>Apply to join</h3>
            
            {/* NÓ: -short_message */}
            <AntdTextArea 
              className="shortMessage"
              rows={6} 
              placeholder="Why do you want to join this community? Tell us about your goals..."
              style={{ borderRadius: "18px", padding: "20px", border: "1px solid #00000017", background: "#fafafa", fontSize: "14px" }}
            />

            {/* NÓ: -invite button */}
            <AntdButton 
              className="inviteButton"
              type="primary" 
              block 
              style={{ 
                height: "60px", borderRadius: "18px", background: "#228b22", 
                borderColor: "#228b22", fontWeight: 800, marginTop: "24px", fontSize: "16px",
                boxShadow: "0 10px 20px rgba(34, 139, 34, 0.2)"
              }}
            >
              {nodes.container2.invite_button}
            </AntdButton>
          </div>

          {/* NÓ: Container 9 (Ratings) */}
          <div className="container9" style={{ ...CSS.cardBase, alignItems: "center", padding: "30px" }}>
            {/* NÓ: -community rate */}
            <AntdRate disabled defaultValue={nodes.container9.community_rate} style={{ color: "#228b22", fontSize: "24px" }} />
            {/* NÓ: -Rate sum */}
            <div className="rateSum" style={{ marginTop: "12px", fontSize: "14px", fontWeight: 700, color: "#535353" }}>
              {nodes.container9.rate_sum}
            </div>
          </div>

          {/* NÓ: Goals sum (O card de impacto) */}
          <div className="goalsSumContainer" style={CSS.goalsCard}>
             <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* NÓ: -Goals sum */}
                <span className="goalsSum" style={{ fontSize: "48px", fontWeight: 900, color: "#228b22", lineHeight: 1 }}>
                  {nodes.goalsSum}
                </span>
                <span style={{ fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#535353", marginTop: "8px", letterSpacing: "1px" }}>
                  Objetivos Alcançados
                </span>
             </div>
          </div>

          {/* NÓ: Container 10 (Slider de Conexões/Empresas) */}
          <div className="container10" style={{ marginTop: "12px", textAlign: "center" }}>
             <span style={{ fontSize: "12px", fontWeight: 600, color: "#999" }}>CONNECTED WITH 24+ COMPANIES</span>
          </div>
        </aside>

      </div>

      {/* FOOTER DE ESPAÇAMENTO FINAL */}
      <footer style={{ height: "100px", width: "100%" }} />

    </div>
  );
}
