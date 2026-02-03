/*
  =============================================================================
  PROJETO: EZ MARKETING PLATFORM 
  PÁGINA: APPLY TO A COMMUNITY (INDIVIDUAL AGÊNCIA)
  STATUS: DEPLOY READY (VERCEL FIXED)
  =============================================================================
*/

import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

// 1. IMPORTS DINÂMICOS (Evita erro de Hydration e corrige o erro do TextArea no Build)
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });

// 2. DESIGN SYSTEM (Extraído do seu CSS)
const THEME = {
  pageBg: "#e7e6e2",
  text: "#535353",
  white: "#ffffff",
  accent: "#228b22",
  border: "#00000017",
  maxWidth: "1064px", // O limite exato solicitado
  font: '"Inter", sans-serif',
  cardGradient: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)"
};

export default function ApplyCommunityPage() {
  const router = useRouter();
  const supabase = getSupabaseA();
  
  // States para os Nós do Backend
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Ação: Sign Out (Nó: Top bar - Account)
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/a-login");
  }

  // Ação: Invite (Nó: invite button)
  async function handleInvite() {
    if (!message) return alert("Por favor, preencha a mensagem de solicitação.");
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("Community_members")
      .insert({
        short_message: message,
        user_id: user?.id,
        role: "member",
        status: "request",
        // ID fixo ou dinâmico da agência {Ez marketing agencies 2}
      });

    setLoading(false);
    if (!error) {
      alert("Solicitação enviada!");
      setMessage("");
    } else {
      alert("Erro ao enviar. Verifique sua conexão.");
    }
  }

  return (
    <div style={{ 
      backgroundColor: THEME.pageBg, 
      minHeight: "100vh", 
      fontFamily: THEME.font, 
      color: THEME.text,
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <Head>
        <title>Apply to Community | Ez Marketing</title>
      </Head>

      {/* TOP BAR (Centralizada) */}
      <nav style={{ 
        width: "100%", 
        background: THEME.white, 
        borderBottom: `1px solid ${THEME.border}`,
        display: "flex",
        justifyContent: "center",
        padding: "15px 0"
      }}>
        <div style={{ width: THEME.maxWidth, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
          <img 
            src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" 
            style={{ height: 35, cursor: "pointer" }} 
            onClick={() => router.push("/")}
          />
          <span onClick={handleLogout} style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Sign out
          </span>
        </div>
      </nav>

      {/* MAIN CONTENT (Limitado a 1064px e Centralizado) */}
      <main style={{ 
        width: THEME.maxWidth, 
        margin: "40px 0", 
        padding: "0 20px",
        display: "grid",
        gridTemplateColumns: "1fr 340px", // Layout Sidebar fixa
        gap: "30px",
        boxSizing: "border-box"
      }}>
        
        {/* COLUNA ESQUERDA: INFOS DA AGÊNCIA */}
        <section style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Header (Nó: community_logo, type, community_name) */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: "#fff", overflow: "hidden", border: `1px solid ${THEME.border}` }}>
              <img src="URL_DA_LOGO_DO_SUPABASE" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: THEME.accent, textTransform: "uppercase" }}>Professional Agency</span>
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>Ez Marketing Agencies 2</h1>
            </div>
          </div>

          {/* Vídeo e Descrição (Nó: Container 8 e 11) */}
          <div style={{ background: THEME.white, padding: "35px", borderRadius: "28px", border: `1px solid ${THEME.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Introduction</h3>
            
            {/* Aspect Ratio 16:9 Centralizado */}
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, overflow: "hidden", borderRadius: "15px", background: "#000" }}>
              <iframe 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // ID dinâmico via nó youtube_video
                frameBorder="0" allowFullScreen 
              />
            </div>

            <div style={{ marginTop: 25 }}>
              <p style={{ fontSize: 14, lineHeight: "1.7", color: "#666" }}>
                Esta é a descrição oficial da comunidade vinda do nó "about". Ela será alimentada dinamicamente pela sua tabela no Supabase.
              </p>
              <a href="#" style={{ color: THEME.accent, fontWeight: 700, textDecoration: "underline" }}>Visit Website</a>
            </div>
          </div>

          {/* Membros (Nó: Slider Carousel) */}
          <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} style={{ 
                minWidth: 140, padding: "12px", borderRadius: "70px", background: THEME.white, border: `4px solid ${THEME.border}`,
                display: "flex", flexDirection: "column", alignItems: "center"
              }}>
                <div style={{ width: 55, height: 55, borderRadius: "50%", background: "#eee", marginBottom: 8 }} />
                <span style={{ fontSize: 10, fontWeight: 700 }}>OFFICE</span>
              </div>
            ))}
          </div>
        </section>

        {/* COLUNA DIREITA: SIDEBAR DE AÇÃO */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Card de Aplicação (Nó: Container 2) */}
          <div style={{ 
            background: THEME.white, padding: "30px", borderRadius: "28px", border: `1px solid ${THEME.border}`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
          }}>
            <h4 style={{ fontSize: 17, fontWeight: 800, marginBottom: 15 }}>Apply to join</h4>
            <AntdTextArea 
              rows={6} 
              placeholder="Why do you want to join this community?" 
              style={{ borderRadius: "12px", padding: "15px", border: "1px solid #eee" }}
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
            />
            <AntdButton 
              type="primary" 
              block 
              onClick={handleInvite}
              loading={loading}
              style={{ background: THEME.accent, borderColor: THEME.accent, height: 50, borderRadius: "12px", fontWeight: 700, marginTop: 20 }}
            >
              SEND INVITE
            </AntdButton>
          </div>

          {/* Ratings (Nó: community rate) */}
          <div style={{ background: THEME.white, padding: "20px", borderRadius: "25px", border: `1px solid ${THEME.border}`, textAlign: "center" }}>
             <AntdRate disabled defaultValue={4.5} style={{ color: THEME.accent }} />
             <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600 }}>128 avaliações feitas</div>
          </div>

          {/* Metas (Nó: Goals sum) */}
          <div style={{ 
            background: THEME.cardGradient, 
            padding: "25px", 
            borderRadius: "70px", 
            border: `4px solid ${THEME.border}`,
            textAlign: "center"
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: THEME.accent }}>850+</div>
            <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase" }}>Objetivos Alcançados</div>
          </div>
        </aside>

      </main>

      <footer style={{ padding: "40px 0", fontSize: 12, color: "#999" }}>
        &copy; 2024 Ez Marketing Space.
      </footer>
    </div>
  );
}
