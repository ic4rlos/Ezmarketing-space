/*
  =============================================================================
  PROJETO: EZ MARKETING PLATFORM 
  FOCO: DESIGN PURO (DESPLASMICADO)
  LARGURA: 1064px (CENTRALIZADO)
  =============================================================================
*/

import * as React from "react";
import Head from "next/head";
import dynamic from "next/dynamic";

// IMPORTS DINÂMICOS (Apenas para garantir que o AntDesign carregue no cliente sem erro de deploy)
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });

// CORES E ESTILOS EXTRAÍDOS DO SEU CSS
const THEME = {
  pageBg: "#e7e6e2",
  text: "#535353",
  white: "#ffffff",
  accent: "#228b22",
  border: "#00000017",
  maxWidth: "1064px", 
  font: '"Inter", sans-serif',
  cardGradient: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)"
};

export default function ApplyCommunityPage() {
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

      {/* TOP BAR - Largura total, mas conteúdo preso em 1064px */}
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
            style={{ height: 35 }} 
            alt="Logo"
          />
          <span style={{ fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
            Sign out
          </span>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL - CENTRALIZADO EM 1064px */}
      <main style={{ 
        width: THEME.maxWidth, 
        margin: "40px 0", 
        padding: "0 20px",
        display: "grid",
        gridTemplateColumns: "1fr 340px", 
        gap: "30px",
        boxSizing: "border-box"
      }}>
        
        {/* COLUNA ESQUERDA: INFOS DA AGÊNCIA */}
        <section style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Header da Comunidade */}
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: 100, height: 100, borderRadius: 20, background: "#fff", overflow: "hidden", border: `1px solid ${THEME.border}` }}>
              <div style={{ width: "100%", height: "100%", background: "#ccc" }} /> {/* Placeholder para Logo */}
            </div>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, color: THEME.accent, textTransform: "uppercase" }}>Professional Agency</span>
              <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0, letterSpacing: "-1px" }}>Ez Marketing Agencies 2</h1>
            </div>
          </div>

          {/* Vídeo e Descrição */}
          <div style={{ background: THEME.white, padding: "35px", borderRadius: "28px", border: `1px solid ${THEME.border}` }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Introduction</h3>
            
            {/* VÍDEO COM PROPORÇÃO CORRETA (16:9) */}
            <div style={{ 
              position: "relative", 
              paddingBottom: "56.25%", 
              height: 0, 
              overflow: "hidden", 
              borderRadius: "15px", 
              background: "#000" 
            }}>
              <iframe 
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                frameBorder="0" 
                allowFullScreen 
              />
            </div>

            <div style={{ marginTop: 25 }}>
              <p style={{ fontSize: 14, lineHeight: "1.7", color: "#666" }}>
                Aqui ficará o texto de descrição da comunidade. Este design segue exatamente os espaçamentos do seu projeto original, mas sem o código pesado do Plasmic.
              </p>
              <a href="#" style={{ color: THEME.accent, fontWeight: 700, textDecoration: "underline" }}>Visit Website</a>
            </div>
          </div>

          {/* Slider de Membros (Visual Simulado) */}
          <div style={{ display: "flex", gap: "15px", overflowX: "auto", paddingBottom: "10px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
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

        {/* COLUNA DIREITA: SIDEBAR */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          
          {/* Card de Aplicação */}
          <div style={{ 
            background: THEME.white, padding: "30px", borderRadius: "28px", border: `1px solid ${THEME.border}`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.02)"
          }}>
            <h4 style={{ fontSize: 17, fontWeight: 800, marginBottom: 15 }}>Apply to join</h4>
            <AntdTextArea 
              rows={6} 
              placeholder="Write your message here..." 
              style={{ borderRadius: "12px", padding: "15px", border: "1px solid #eee" }}
            />
            <AntdButton 
              type="primary" 
              block 
              style={{ background: THEME.accent, borderColor: THEME.accent, height: 50, borderRadius: "12px", fontWeight: 700, marginTop: 20 }}
            >
              SEND INVITE
            </AntdButton>
          </div>

          {/* Ratings */}
          <div style={{ background: THEME.white, padding: "20px", borderRadius: "25px", border: `1px solid ${THEME.border}`, textAlign: "center" }}>
             <AntdRate disabled defaultValue={4} style={{ color: THEME.accent }} />
             <div style={{ marginTop: 8, fontSize: 12, fontWeight: 600 }}>128 avaliações</div>
          </div>

          {/* Goals Card (Com o gradiente do seu CSS) */}
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
