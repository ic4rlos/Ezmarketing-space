/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

// --- COMPONENTES UI (Ant Design com SSR false) ---
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });
const AntdAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), { ssr: false });
const AntdMessage = dynamic(() => import("antd").then((mod) => mod.message), { ssr: false });
const AntdSpin = dynamic(() => import("antd").then((mod) => mod.Spin), { ssr: false });

/**
 * @style SISTEMA DE DESIGN AVANÇADO (DNA VISUAL)
 * Foco total em manter os 1064px centralizados e a estética premium.
 */
const UI = {
  colors: {
    page: "#e7e6e2",
    card: "#ffffff",
    brand: "#228b22",
    text: "#1a1a1a",
    sub: "#535353",
    border: "#00000017",
    grad: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
  },
  spacing: {
    max: "1064px",
    gap: "32px",
    radiusCard: "32px",
    radiusPill: "80px",
  }
};

const CSS_INLINE = `
  .page-root {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    min-height: 100vh;
    background-color: ${UI.colors.page};
    font-family: 'Inter', sans-serif;
  }
  .top-bar {
    width: 100%;
    height: 80px;
    background: #fff;
    border-bottom: 1px solid ${UI.colors.border};
    display: flex;
    justify-content: center;
    position: sticky;
    top: 0;
    z-index: 999;
  }
  .container-1064 {
    width: 100%;
    max-width: ${UI.spacing.max};
    display: flex;
    padding: 0 20px;
    justify-content: space-between;
    align-items: center;
  }
  .main-content {
    width: 100%;
    max-width: ${UI.spacing.max};
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: ${UI.spacing.gap};
    padding: 48px 20px;
  }
  .card-premium {
    background: #fff;
    border-radius: ${UI.spacing.radiusCard};
    padding: 40px;
    border: 1px solid ${UI.colors.border};
    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
  }
  .video-wrapper {
    position: relative;
    padding-bottom: 56.25%;
    border-radius: 24px;
    overflow: hidden;
    background: #000;
    margin: 24px 0;
  }
  .member-pill {
    min-width: 160px;
    height: 120px;
    background: ${UI.colors.grad};
    border-radius: ${UI.spacing.radiusPill};
    border: 4px solid ${UI.colors.border};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .goals-card {
    background: ${UI.colors.grad};
    border-radius: ${UI.spacing.radiusPill};
    padding: 40px;
    border: 4px solid ${UI.colors.border};
    text-align: center;
  }
  @media (max-width: 1000px) {
    .main-content { grid-template-columns: 1fr; }
  }
`;

export default function PlasmicAApplyToACommunity() {
  const router = useRouter();
  const supabase = getSupabaseA();
  
  // Estados de Dados
  const [session, setSession] = React.useState(null);
  const [community, setCommunity] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [connections, setConnections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");

  // ID da Agência Fixa (Ez marketing agencies 2)
  const COMM_ID = "ez-marketing-agencies-2-uuid";

  React.useEffect(() => {
    checkUserAndFetch();
  }, []);

  async function checkUserAndFetch() {
    setLoading(true);
    
    // PROTEÇÃO DE PÁGINA (PAGE GUARD)
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      // Se não estiver logado, manda para o login
      router.push("/login"); 
      return;
    }

    setSession(currentSession);

    try {
      // Nó: Community Data
      const { data: c } = await supabase.from('Community').select('*').eq('id', COMM_ID).single();
      setCommunity(c);

      // Nó: Members Join (Multicharge + User Profile)
      const { data: m } = await supabase.from('Community_members')
        .select('role, user_id, user_profile:user_id(full_name, avatar_url), multicharge:user_id(office)')
        .eq('community_id', COMM_ID);
      setMembers(m || []);

      // Nó: Connections
      const { data: cn } = await supabase.from('Connection')
        .select('companies(name, logo_url)')
        .eq('agency_id', COMM_ID);
      setConnections(cn || []);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleActionInvite() {
    if (!session) return;
    const { error } = await supabase.from('Community_members').insert({
      community_id: COMM_ID,
      user_id: session.user.id,
      short_message: msg,
      role: 'member',
      status: 'request'
    });
    if (!error) {
      AntdMessage.success("Aplicação enviada!");
      setMsg("");
    }
  }

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: UI.colors.page }}>
      <AntdSpin size="large" tip="Verificando acesso..." />
    </div>
  );

  return (
    <div className="page-root">
      <Head>
        <title>{community?.community_name || 'Apply'} | Ez Marketing</title>
        <style>{CSS_INLINE}</style>
      </Head>

      {/* TOP BAR TRAVADA NO CENTRO */}
      <header className="top-bar">
        <div className="container-1064">
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: 40 }} />
          <div onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} 
               style={{ cursor: "pointer", fontWeight: 700, color: UI.colors.sub }}>
            Sign out
          </div>
        </div>
      </header>

      {/* CONTEÚDO 1064px */}
      <main className="main-content">
        
        {/* COLUNA ESQUERDA (DADOS AGÊNCIA) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          
          {/* HEADER (Nó: Container 3) */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{ width: 130, height: 130, background: "#fff", borderRadius: 28, border: `1px solid ${UI.colors.border}`, padding: 8 }}>
              <img src={community?.community_logo} style={{ width: '100%', height: '100%', borderRadius: 20, objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ color: UI.colors.brand, fontWeight: 800, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1.5 }}>
                {community?.type || 'AGENCY'}
              </div>
              <h1 style={{ fontSize: 40, fontWeight: 900, margin: '4px 0', letterSpacing: -1.5 }}>
                {community?.community_name}
              </h1>
            </div>
          </div>

          {/* VÍDEO E SOBRE (Nó: Container 8/11) */}
          <section className="card-premium">
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Introduction</h2>
            {community?.youtube_video && (
              <div className="video-wrapper">
                <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        src={`https://www.youtube.com/embed/${community.youtube_video}`} frameBorder="0" allowFullScreen />
              </div>
            )}
            <p style={{ fontSize: 16, lineHeight: 1.8, color: UI.colors.sub, marginTop: 24 }}>
              {community?.about}
            </p>
            <a href={community?.website} style={{ color: UI.colors.brand, fontWeight: 800, marginTop: 16, display: 'inline-block' }}>
              Visit Website →
            </a>
          </section>

          {/* SLIDER MEMBROS (¨¨member) */}
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 900, color: '#aaa', textTransform: 'uppercase', marginBottom: 16 }}>Community Members</h3>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 12 }}>
              {members.map((m, i) => (
                <div key={i} className="member-pill">
                  <AntdAvatar src={m.user_profile?.avatar_url} size={50} style={{ marginBottom: 8 }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color: UI.colors.text }}>{m.multicharge?.office || 'Member'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA (SIDEBAR) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          {/* APLICAÇÃO (Nó: Container 2) */}
          <div className="card-premium">
            <h3 style={{ fontSize: 20, fontWeight: 900, marginBottom: 20 }}>Apply to join</h3>
            <AntdTextArea value={msg} onChange={e => setMsg(e.target.value)} rows={5} placeholder="Write your message..."
                          style={{ borderRadius: 16, border: `1px solid ${UI.colors.border}`, background: '#f9f9f9' }} />
            <AntdButton type="primary" block onClick={handleActionInvite}
                        style={{ height: 56, borderRadius: 16, background: UI.colors.brand, border: 'none', fontWeight: 800, marginTop: 20 }}>
              SEND INVITE
            </AntdButton>
          </div>

          {/* RATINGS (Nó: Container 9) */}
          <div className="card-premium" style={{ textAlign: 'center' }}>
            <AntdRate disabled defaultValue={4.5} style={{ color: UI.colors.brand, fontSize: 24 }} />
            <div style={{ fontWeight: 700, fontSize: 14, marginTop: 8 }}>128 Reviews</div>
          </div>

          {/* GOALS (Nó: Goals Sum) */}
          <div className="goals-card">
            <div style={{ fontSize: 42, fontWeight: 900, color: UI.colors.brand }}>850+</div>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase' }}>Objetivos Alcançados</div>
          </div>
        </div>
      </main>
      
      <footer style={{ height: 100 }} />
    </div>
  );
}
