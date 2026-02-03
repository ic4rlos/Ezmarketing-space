/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// Cliente Supabase importado conforme sua instrução
import { getSupabaseA } from "../lib/a-supabaseClient";

// --- UI COMPONENTS (Ant Design com SSR false para estabilidade no build) ---
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const AntdTextArea = dynamic(() => import("antd").then((mod) => mod.Input.TextArea), { ssr: false });
const AntdAvatar = dynamic(() => import("antd").then((mod) => mod.Avatar), { ssr: false });
const AntdMessage = dynamic(() => import("antd").then((mod) => mod.message), { ssr: false });
const AntdSpin = dynamic(() => import("antd").then((mod) => mod.Spin), { ssr: false });

/**
 * CONFIGURAÇÕES DE DESIGN (Inspirado no seu CSS e gosto refinado)
 * Foco: 1064px centralizados, sombras suaves e tipografia Inter.
 */
const THEME = {
  colors: {
    bg: "#e7e6e2",
    card: "#ffffff",
    brand: "#228b22",
    textMain: "#1a1a1a",
    textSub: "#535353",
    border: "#00000017",
    grad: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)"
  },
  layout: {
    maxWidth: "1064px",
    sidebarWidth: "360px",
    gap: "32px",
    radius: "32px",
    pillRadius: "80px"
  }
};

export default function ApplyToCommunity() {
  const router = useRouter();
  const supabase = getSupabaseA();

  // --- ESTADOS DE DADOS (Baseados nos nós de Backend) ---
  const [session, setSession] = React.useState(null);
  const [community, setCommunity] = React.useState(null);
  const [members, setMembers] = React.useState([]);
  const [connections, setConnections] = React.useState([]);
  const [stats, setStats] = React.useState({ avg: 0, sum: 0 });
  const [loading, setLoading] = React.useState(true);
  const [applicationMsg, setApplicationMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // ID da Agência alvo conforme instrução
  const TARGET_AGENCY = "ez-marketing-agencies-2-uuid";

  React.useEffect(() => {
    initPage();
  }, []);

  /**
   * INICIALIZAÇÃO E PAGE GUARD
   */
  async function initPage() {
    setLoading(true);
    
    // Verificação de Sessão (Instrução: Usuário logado)
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      router.push("/a-login");
      return;
    }
    setSession(currentSession);

    try {
      // 1. Nó: community_logo, type, community_name, about, website, youtube_video
      const { data: commData } = await supabase
        .from('Community')
        .select('*')
        .eq('id', TARGET_AGENCY)
        .single();
      setCommunity(commData);

      // 2. Nó: ¨¨member (Join entre Community_members, Multicharge e User profile)
      const { data: memberData } = await supabase
        .from('Community_members')
        .select(`
          user_id,
          multicharge:user_id ( office ),
          user_profile:user_id ( full_name, avatar_url )
        `)
        .eq('community_id', TARGET_AGENCY);
      setMembers(memberData || []);

      // 3. Nó: Slider Carousel 2 (Connections e Companies)
      const { data: connData } = await supabase
        .from('Connection')
        .select('companies ( name, logo_url )')
        .eq('agency_id', TARGET_AGENCY);
      setConnections(connData || []);

      // 4. Nó: community rate e Rate sum (Cálculos de reviews)
      const { data: reviews } = await supabase
        .from('community_reviews')
        .select('rating')
        .eq('community_id', TARGET_AGENCY)
        .eq('author_type', 'company');
      
      if (reviews && reviews.length > 0) {
        const sum = reviews.reduce((a, b) => a + b.rating, 0);
        setStats({ avg: sum / reviews.length, sum: reviews.length });
      }

    } catch (err) {
      console.error("Erro no fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  /**
   * AÇÃO: invite button (Nó: Container 2)
   */
  async function handleApply() {
    if (!applicationMsg.trim()) {
      return AntdMessage.warning("Por favor, escreva uma mensagem.");
    }
    
    setIsSubmitting(true);
    const { error } = await supabase.from('Community_members').insert({
      community_id: TARGET_AGENCY,
      user_id: session.user.id,
      short_message: applicationMsg,
      role: 'member',
      status: 'request'
    });

    if (!error) {
      AntdMessage.success("Aplicação enviada com sucesso!");
      setApplicationMsg("");
    } else {
      AntdMessage.error("Erro ao processar sua aplicação.");
    }
    setIsSubmitting(false);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) return (
    <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.colors.bg }}>
      <AntdSpin size="large" tip="Carregando Comunidade..." />
    </div>
  );

  return (
    <div style={{ background: THEME.colors.bg, minHeight: "100vh", fontFamily: '"Inter", sans-serif' }}>
      <Head>
        <title>{community?.community_name} | Apply to Community</title>
      </Head>

      {/* --- TOP BAR (Nó: Top bar) --- */}
      <header style={{ 
        width: "100%", height: "80px", background: "#fff", borderBottom: `1px solid ${THEME.colors.border}`,
        display: "flex", justifyContent: "center", position: "sticky", top: 0, zIndex: 1000 
      }}>
        <div style={{ width: THEME.layout.maxWidth, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" }}>
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: "40px" }} />
          <div onClick={handleSignOut} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
             <span style={{ fontWeight: 700, fontSize: "14px", color: THEME.colors.textSub }}>Sign out</span>
             <AntdAvatar src={session?.user?.user_metadata?.avatar_url} />
          </div>
        </div>
      </header>

      {/* --- CONTEÚDO PRINCIPAL (TRAVADO EM 1064px) --- */}
      <main style={{ 
        width: "100%", maxWidth: THEME.layout.maxWidth, margin: "0 auto", 
        display: "grid", gridTemplateColumns: `1fr ${THEME.layout.sidebarWidth}`, 
        gap: THEME.layout.gap, padding: "48px 20px" 
      }}>
        
        {/* COLUNA ESQUERDA: INFOS DA AGÊNCIA */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          
          {/* NÓ: Container 3 (Header) */}
          <section style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{ 
              width: "140px", height: "140px", background: "#fff", 
              borderRadius: "30px", border: `1px solid ${THEME.colors.border}`, padding: "12px" 
            }}>
              <img src={community?.community_logo} style={{ width: "100%", height: "100%", borderRadius: "20px", objectFit: "cover" }} />
            </div>
            <div>
              <span style={{ color: THEME.colors.brand, fontWeight: 800, fontSize: "12px", textTransform: "uppercase", letterSpacing: "1.5px" }}>
                {community?.type}
              </span>
              <h1 style={{ fontSize: "42px", fontWeight: 900, margin: "4px 0", color: THEME.colors.textMain, letterSpacing: "-2px" }}>
                {community?.community_name}
              </h1>
            </div>
          </section>

          {/* NÓ: Container 8 (Vídeo e Descrição) */}
          <section style={{ 
            background: THEME.colors.card, borderRadius: THEME.layout.radius, padding: "40px", 
            border: `1px solid ${THEME.colors.border}`, boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
          }}>
            <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "24px" }}>Introduction</h2>
            
            {/* NÓ: -youtube_video (Prop Video ID) */}
            {community?.youtube_video && (
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0, borderRadius: "24px", overflow: "hidden", background: "#000" }}>
                <iframe 
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                  src={`https://www.youtube.com/embed/${community.youtube_video}`} 
                  frameBorder="0" allowFullScreen 
                />
              </div>
            )}

            {/* NÓ: Container 11 (Textos) */}
            <div style={{ marginTop: "32px" }}>
              <p style={{ fontSize: "16px", lineHeight: "1.8", color: THEME.colors.textSub }}>
                {community?.about}
              </p>
              <a href={community?.website} target="_blank" style={{ color: THEME.colors.brand, fontWeight: 800, display: "inline-block", marginTop: "16px" }}>
                Visit website →
              </a>
            </div>
          </section>

          {/* NÓ: ¨¨member (Slider Carousel de Membros) */}
          <section>
             <h3 style={{ fontSize: "11px", fontWeight: 900, color: "#aaa", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "1px" }}>
               Community Members
             </h3>
             <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "12px" }}>
                {members.map((m, i) => (
                  <div key={i} style={{ 
                    minWidth: "160px", height: "125px", background: THEME.colors.grad, 
                    borderRadius: THEME.layout.pillRadius, border: `4px solid ${THEME.colors.border}`,
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
                  }}>
                    <AntdAvatar src={m.user_profile?.avatar_url} size={50} style={{ marginBottom: "8px", border: "2px solid #fff" }} />
                    <span style={{ fontSize: "10px", fontWeight: 800, color: THEME.colors.textSub, textTransform: "uppercase" }}>
                      {m.multicharge?.office || "Member"}
                    </span>
                  </div>
                ))}
             </div>
          </section>
        </div>

        {/* COLUNA DIREITA: SIDEBAR */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* NÓ: Container 2 (Formulário) */}
          <div style={{ background: THEME.colors.card, borderRadius: THEME.layout.radius, padding: "35px", border: `1px solid ${THEME.colors.border}` }}>
            <h3 style={{ fontSize: "22px", fontWeight: 900, marginBottom: "20px" }}>Apply to join</h3>
            <AntdTextArea 
              value={applicationMsg}
              onChange={(e) => setApplicationMsg(e.target.value)}
              rows={6} 
              placeholder="Why do you want to join? Tell us about your goals..."
              style={{ borderRadius: "18px", padding: "18px", background: "#f9f9f9", border: `1px solid ${THEME.colors.border}` }}
            />
            <AntdButton 
              type="primary" block loading={isSubmitting} onClick={handleApply}
              style={{ height: "60px", borderRadius: "18px", background: THEME.colors.brand, border: "none", fontWeight: 800, marginTop: "20px", fontSize: "16px" }}
            >
              SEND INVITE
            </AntdButton>
          </div>

          {/* NÓ: Container 9 (Ratings) */}
          <div style={{ background: THEME.colors.card, borderRadius: THEME.layout.radius, padding: "30px", border: `1px solid ${THEME.colors.border}`, textAlign: "center" }}>
            <AntdRate disabled value={stats.avg} style={{ color: THEME.colors.brand, fontSize: "24px" }} />
            <div style={{ marginTop: "12px", fontSize: "14px", fontWeight: 700, color: THEME.colors.textSub }}>
              {stats.sum} Agency Reviews
            </div>
          </div>

          {/* NÓ: Goals sum */}
          <div style={{ 
            background: THEME.colors.grad, borderRadius: THEME.layout.pillRadius, 
            padding: "40px", border: `4px solid ${THEME.colors.border}`, textAlign: "center" 
          }}>
            <div style={{ fontSize: "44px", fontWeight: 900, color: THEME.colors.brand, lineHeight: 1 }}>850+</div>
            <div style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", marginTop: "10px", color: THEME.colors.textSub }}>
              Objetivos Alcançados
            </div>
          </div>

          {/* NÓ: Slider Carousel 2 (Connections) */}
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#999" }}>
              CONNECTED WITH {connections.length} COMPANIES
            </span>
          </div>
        </aside>

      </main>

      <footer style={{ height: "100px", width: "100%" }} />
    </div>
  );
}
