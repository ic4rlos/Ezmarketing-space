/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

// --- COMPONENTES UI (Ant Design com SSR false para evitar erros de hidratação) ---
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });
const AntdAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), { ssr: false });
const AntdMessage = dynamic(() => import("antd").then((mod) => mod.message), { ssr: false });
const AntdSpin = dynamic(() => import("antd").then((mod) => mod.Spin), { ssr: false });

/**
 * @design SISTEMA DE CORES E ESTILOS (Vindo do seu .css)
 * Centralização em 1064px e refinamento visual.
 */
const THEME = {
  bg: "#e7e6e2",
  card: "#ffffff",
  primary: "#228b22", // Verde Agência
  textMain: "#1a1a1a",
  textSub: "#535353",
  border: "#00000017",
  shadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
  gradient: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
  maxWidth: "1064px",
};

const STYLES = {
  root: {
    display: "grid",
    width: "100%",
    minHeight: "100vh",
    background: THEME.bg,
    fontFamily: '"Inter", sans-serif',
    gridTemplateColumns: "1fr minmax(0, 1064px) 1fr",
    alignContent: "flex-start",
  },
  topBar: {
    gridColumn: "1 / -1",
    height: "80px",
    background: "#fff",
    borderBottom: `1px solid ${THEME.border}`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  content: {
    gridColumn: "2",
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "40px",
    padding: "48px 0",
  },
  card: {
    background: THEME.card,
    borderRadius: "32px",
    padding: "40px",
    border: `1px solid ${THEME.border}`,
    boxShadow: THEME.shadow,
    transition: "transform 0.3s ease",
  },
  videoContainer: {
    position: "relative",
    paddingBottom: "56.25%",
    height: 0,
    borderRadius: "24px",
    overflow: "hidden",
    background: "#000",
  }
};

export default function ApplyCommunityPage() {
  const router = useRouter();
  const supabase = getSupabaseA();
  const [user, setUser] = React.useState(null);
  const [community, setCommunity] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [connections, setConnections] = React.useState([]);
  const [reviews, setReviews] = React.useState({ avg: 0, count: 0 });
  const [loading, setLoading] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [shortMessage, setShortMessage] = React.useState("");

  // ID da Agência (Fixado conforme seu documento: Ez marketing agencies 2)
  const COMMUNITY_ID = "ez-marketing-agencies-2-uuid"; 

  React.useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Get User
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // 2. Fetch Community Data (Nó: Container 3, Container 8, Container 11)
      const { data: comm } = await supabase
        .from('Community')
        .select('*')
        .eq('id', COMMUNITY_ID)
        .single();
      setCommunity(comm);

      // 3. Fetch Members with Join (Nó: Slider Carousel - member)
      const { data: mems } = await supabase
        .from('Community_members')
        .select(`
          role,
          user_id,
          user_profile:user_id (full_name, avatar_url),
          multicharge:user_id (office)
        `)
        .eq('community_id', COMMUNITY_ID);
      setMembers(mems || []);

      // 4. Fetch Connections (Nó: Slider Carousel 2)
      const { data: conns } = await supabase
        .from('Connection')
        .select('company_id, companies(name, logo_url)')
        .eq('agency_id', COMMUNITY_ID);
      setConnections(conns || []);

      // 5. Fetch Reviews (Nó: Container 9)
      const { data: revs } = await supabase
        .from('community_reviews')
        .select('rating')
        .eq('community_id', COMMUNITY_ID)
        .eq('author_type', 'company');
      
      if (revs) {
        const avg = revs.reduce((acc, curr) => acc + curr.rating, 0) / revs.length;
        setReviews({ avg: avg || 0, count: revs.length });
      }

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleInvite() {
    if (!user) return AntdMessage.error("Precisa estar logado!");
    setSending(true);
    
    // Ação do Nó: invite button
    const { error } = await supabase.from('Community_members').insert({
      community_id: COMMUNITY_ID,
      user_id: user.id,
      short_message: shortMessage,
      role: 'member',
      status: 'request'
    });

    if (error) {
      AntdMessage.error("Erro ao enviar convite");
    } else {
      AntdMessage.success("Convite enviado com sucesso!");
      setShortMessage("");
    }
    setSending(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: THEME.bg }}>
      <AntdSpin size="large" />
    </div>
  );

  return (
    <div className="root" style={STYLES.root}>
      <Head>
        <title>{community?.community_name || "Loading..."} | Ez Marketing</title>
      </Head>

      {/* --- TOP BAR (Nó: Top bar) --- */}
      <header style={STYLES.topBar}>
        <div style={{ width: THEME.maxWidth, display: "flex", justifyContent: "space-between", padding: "0 20px" }}>
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: "40px" }} />
          <div onClick={handleLogout} style={{ cursor: "pointer", fontWeight: 700, color: THEME.textSub, display: "flex", alignItems: "center", gap: "8px" }}>
            <span>Sign out</span>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#eee" }} />
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO --- */}
      <main style={STYLES.content}>
        
        {/* COLUNA ESQUERDA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* HEADER (Nó: Container 3) */}
          <section style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            <div style={{ width: 140, height: 140, background: "#fff", borderRadius: "32px", border: `1px solid ${THEME.border}`, padding: "12px" }}>
              <img src={community?.community_logo} style={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ color: THEME.primary, fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                {community?.type}
              </span>
              <h1 style={{ fontSize: "42px", fontWeight: 900, color: THEME.textMain, margin: "4px 0", letterSpacing: "-2px" }}>
                {community?.community_name}
              </h1>
            </div>
          </section>

          {/* INTRODUÇÃO (Nó: Container 8 & 11) */}
          <section style={STYLES.card}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px" }}>Introdução</h2>
            
            {/* VÍDEO (Nó: youtubeVideo) */}
            {community?.youtube_video && (
              <div style={STYLES.videoContainer}>
                <iframe 
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  src={`https://www.youtube.com/embed/${community.youtube_video}`}
                  frameBorder="0" allowFullScreen 
                />
              </div>
            )}

            <div style={{ marginTop: "32px" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: THEME.textSub }}>
                {community?.about}
              </p>
              <a href={community?.website} target="_blank" style={{ color: THEME.primary, fontWeight: 800, display: "block", marginTop: "16px", textDecoration: "underline" }}>
                Visitar Website Oficial →
              </a>
            </div>
          </section>

          {/* MEMBROS (Nó: Slider Carousel ¨¨member) */}
          <section>
             <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#888", marginBottom: "20px", textTransform: "uppercase" }}>Membros da Comunidade</h3>
             <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "10px" }}>
                {members.map((m, i) => (
                  <div key={i} style={{ 
                    minWidth: "160px", padding: "24px", background: THEME.card, borderRadius: "80px", 
                    border: `4px solid ${THEME.border}`, textAlign: "center", background: THEME.gradient
                  }}>
                    <AntdAvatar src={m.user_profile?.avatar_url} size={54} style={{ marginBottom: "12px" }} />
                    <div style={{ fontSize: "11px", fontWeight: 900, color: THEME.textMain, textTransform: "uppercase" }}>
                      {m.multicharge?.office || "Membro"}
                    </div>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* COLUNA DIREITA */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* APLICAÇÃO (Nó: Container 2) */}
          <div style={STYLES.card}>
            <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "20px" }}>Candidatar-se</h3>
            <AntdTextArea 
              value={shortMessage}
              onChange={(e) => setShortMessage(e.target.value)}
              rows={5} 
              placeholder="Escreva uma breve mensagem de introdução..."
              style={{ borderRadius: "18px", border: `1px solid ${THEME.border}`, background: "#f9f9f9", padding: "16px" }}
            />
            <AntdButton 
              type="primary" 
              block 
              loading={sending}
              onClick={handleInvite}
              style={{ height: "60px", borderRadius: "18px", background: THEME.primary, fontWeight: 800, marginTop: "24px", fontSize: "16px" }}
            >
              ENVIAR CONVITE
            </AntdButton>
          </div>

          {/* RATINGS (Nó: Container 9) */}
          <div style={{ ...STYLES.card, textAlign: "center", padding: "30px" }}>
            <AntdRate disabled value={reviews.avg} style={{ color: THEME.primary, fontSize: "24px" }} />
            <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: 700 }}>
              {reviews.count} Reviews de Empresas
            </div>
          </div>

          {/* GOALS (Nó: Goals sum) */}
          <div style={{ 
            background: THEME.gradient, borderRadius: "80px", padding: "40px", 
            border: `4px solid ${THEME.border}`, textAlign: "center"
          }}>
            <div style={{ fontSize: "42px", fontWeight: 900, color: THEME.primary, lineHeight: 1 }}>850+</div>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginTop: "8px" }}>Objetivos Alcançados</div>
          </div>

          {/* CONEXÕES (Nó: Slider Carousel 2) */}
          <div style={{ textAlign: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#999" }}>CONECTADO COM {connections.length} EMPRESAS</span>
          </div>
        </aside>
      </main>

      {/* FOOTER RESERVADO PARA POPOVERS */}
      <footer style={{ height: "100px" }} />
    </div>
  );
}
