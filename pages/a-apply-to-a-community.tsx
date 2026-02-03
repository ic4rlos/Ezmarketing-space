/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

// --- COMPONENTES UI (Ant Design com proteção SSR) ---
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });
const AntdAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), { ssr: false });
const AntdMessage = dynamic(() => import("antd").then((mod) => mod.message), { ssr: false });
const AntdSpin = dynamic(() => import("antd").then((mod) => mod.Spin), { ssr: false });

/**
 * @css SISTEMA DE DESIGN DE ELITE (1064px)
 * Este bloco de CSS injetado garante que o design não "quebre" no deploy.
 */
const GLOBAL_STYLE = `
  body { margin: 0; padding: 0; background: #e7e6e2; font-family: 'Inter', sans-serif; }
  .layout-wrapper { display: flex; flex-direction: column; align-items: center; width: 100%; }
  .top-bar-full { width: 100%; height: 80px; background: #fff; border-bottom: 1px solid #00000017; display: flex; justify-content: center; position: sticky; top: 0; z-index: 1000; }
  .container-1064 { width: 100%; max-width: 1064px; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; box-sizing: border-box; }
  .main-grid { display: grid; grid-template-columns: 1fr 360px; gap: 32px; width: 100%; max-width: 1064px; padding: 48px 24px; box-sizing: border-box; }
  
  .card-premium { background: #fff; border-radius: 32px; border: 1px solid #00000017; padding: 40px; box-shadow: 0 12px 40px rgba(0,0,0,0.04); }
  .video-canvas { width: 100%; position: relative; padding-bottom: 56.25%; background: #000; border-radius: 24px; overflow: hidden; margin: 24px 0; }
  
  .member-pill { 
    min-width: 150px; height: 110px; flex-shrink: 0;
    background: radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%);
    border-radius: 70px; border: 4px solid #00000017;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .goals-badge {
    background: radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%);
    border-radius: 80px; padding: 48px; border: 4px solid #00000017; text-align: center;
  }

  @media (max-width: 1024px) { .main-grid { grid-template-columns: 1fr; } }
`;

export default function PlasmicAApplyToACommunity() {
  const router = useRouter();
  const supabase = getSupabaseA();
  
  // -- ESTADOS (BACKEND NODES) --
  const [session, setSession] = React.useState(null);
  const [community, setCommunity] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [connections, setConnections] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [inviteMsg, setInviteMsg] = React.useState("");

  // ID Alvo: Ez marketing agencies 2
  const TARGET_ID = "ez-marketing-agencies-2-uuid";

  React.useEffect(() => {
    async function loadData() {
      // 1. PAGE GUARD (Bloqueio de acesso)
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) { router.push("/a-login"); return; }
      setSession(currentSession);

      try {
        // 2. FETCH COMMUNITY (Nós: community_logo, about, etc)
        const { data: comm } = await supabase.from('Community').select('*').eq('id', TARGET_ID).single();
        setCommunity(comm);

        // 3. FETCH MEMBERS (Nó: ¨¨member - Repetitive Stack)
        const { data: mems } = await supabase.from('Community_members')
          .select('multicharge:user_id(office), user_profile:user_id(avatar_url, full_name)')
          .eq('community_id', TARGET_ID);
        setMembers(mems || []);

        // 4. FETCH CONNECTIONS (Nó: Slider Carousel 2)
        const { data: conns } = await supabase.from('Connection')
          .select('companies(name, logo_url)')
          .eq('agency_id', TARGET_ID);
        setConnections(conns || []);

      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    loadData();
  }, []);

  async function onSendInvite() {
    if (!inviteMsg) return AntdMessage.warning("Escreva uma mensagem!");
    const { error } = await supabase.from('Community_members').insert({
      community_id: TARGET_ID,
      user_id: session.user.id,
      short_message: inviteMsg,
      role: 'member',
      status: 'request'
    });
    if (!error) { AntdMessage.success("Enviado!"); setInviteMsg(""); }
  }

  if (loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}><AntdSpin size="large"/></div>;

  return (
    <div className="layout-wrapper">
      <Head>
        <title>{community?.community_name} | Platform</title>
        <style>{GLOBAL_STYLE}</style>
      </Head>

      {/* TOP BAR (Nó: Top bar) */}
      <header className="top-bar-full">
        <div className="container-1064">
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: 45 }} />
          <div onClick={() => supabase.auth.signOut().then(() => router.push("/login"))} style={{ cursor: 'pointer', fontWeight: 800, color: '#535353' }}>
            Sign out
          </div>
        </div>
      </header>

      {/* CONTENT (Nó: 1064px) */}
      <main className="main-grid">
        
        {/* LADO ESQUERDO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          
          {/* HEADER AGÊNCIA (Nó: Container 3) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 140, height: 140, background: '#fff', borderRadius: 32, border: '1px solid #00000017', padding: 12 }}>
              <img src={community?.community_logo} style={{ width: '100%', height: '100%', borderRadius: 24, objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ color: '#228b22', fontWeight: 900, fontSize: 12, textTransform: 'uppercase' }}>{community?.type}</div>
              <h1 style={{ fontSize: 44, fontWeight: 900, margin: '4px 0', letterSpacing: '-2px' }}>{community?.community_name}</h1>
            </div>
          </div>

          {/* INTRO (Nó: Container 8) */}
          <section className="card-premium">
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>Introduction</h2>
            {community?.youtube_video && (
              <div className="video-canvas">
                <iframe style={{position:'absolute', top:0, left:0, width:'100%', height:'100%'}} src={`https://www.youtube.com/embed/${community.youtube_video}`} frameBorder="0" allowFullScreen />
              </div>
            )}
            <p style={{ fontSize: 16, lineHeight: 1.8, color: '#535353' }}>{community?.about}</p>
            <a href={community?.website} target="_blank" style={{ color: '#228b22', fontWeight: 800, textDecoration: 'underline', marginTop: 16, display: 'block' }}>Visit official website →</a>
          </section>

          {/* MEMBROS (Nó: ¨¨member) */}
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '10px 0' }}>
            {members.map((m, i) => (
              <div key={i} className="member-pill">
                <AntdAvatar src={m.user_profile?.avatar_url} size={50} style={{ marginBottom: 8 }} />
                <span style={{ fontSize: 10, fontWeight: 900 }}>{m.multicharge?.office || "MEMBER"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIDEBAR (LADO DIREITO) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* FORM (Nó: Container 2) */}
          <div className="card-premium">
            <h3 style={{ fontSize: 22, fontWeight: 900, marginBottom: 20 }}>Join Community</h3>
            <AntdTextArea value={inviteMsg} onChange={e => setInviteMsg(e.target.value)} rows={6} placeholder="Message..." style={{ borderRadius: 16, background: '#fcfcfc' }} />
            <AntdButton type="primary" block onClick={onSendInvite} style={{ height: 60, borderRadius: 16, background: '#228b22', border: 'none', fontWeight: 800, marginTop: 24 }}>SEND INVITE</AntdButton>
          </div>

          {/* RATING (Nó: Container 9) */}
          <div className="card-premium" style={{ textAlign: 'center' }}>
            <AntdRate disabled defaultValue={4.5} style={{ color: '#228b22', fontSize: 26 }} />
            <div style={{ marginTop: 12, fontWeight: 700 }}>128 Agency Reviews</div>
          </div>

          {/* IMPACTO (Nó: Goals sum) */}
          <div className="goals-badge">
            <div style={{ fontSize: 48, fontWeight: 900, color: '#228b22' }}>850+</div>
            <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>Objetivos Alcançados</div>
          </div>
        </div>
      </main>
    </div>
  );
}
