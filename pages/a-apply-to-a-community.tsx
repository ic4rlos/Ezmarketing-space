import * as React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { getSupabaseA } from "../lib/a-supabaseClient";

// --- UI COMPONENTS ---
const AntdButton = dynamic(() => import("antd").then((mod) => mod.Button), { ssr: false });
const AntdInput = dynamic(() => import("antd").then((mod) => mod.Input), { ssr: false });
const AntdRate = dynamic(() => import("antd").then((mod) => mod.Rate), { ssr: false });
const { TextArea } = AntdInput;

// --- CORES EXTRAÍDAS DO SEU CSS ---
const STYLES = {
  pageBg: "#e7e6e2",
  text: "#535353",
  white: "#ffffff",
  border: "#00000017",
  fontFamily: '"Inter", sans-serif',
  accent: "#228b22", // Verde da agência
  cardGradient: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)"
};

export default function ApplyCommunityPage() {
  const router = useRouter();
  const supabase = getSupabaseA();
  
  // States baseados nos nós do Backend
  const [message, setMessage] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Função de Invite (Nó: invite button)
  async function handleInvite() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("Community_members")
      .insert({
        short_message: message,
        user_id: user?.id,
        role: "member",
        status: "request",
        community_id: "ID_DA_AGENCIA_AQUI" // Ez marketing agencies 2
      });

    setLoading(false);
    if (!error) alert("Solicitação enviada!");
  }

  return (
    <div style={{ 
      backgroundColor: STYLES.pageBg, 
      minHeight: "100vh", 
      fontFamily: STYLES.fontFamily,
      color: STYLES.text 
    }}>
      <Head><title>Apply to Community</title></Head>

      {/* TOP BAR CENTRALIZADA */}
      <nav style={{ background: STYLES.white, borderBottom: `1px solid ${STYLES.border}`, display: 'flex', justifyContent: 'center', padding: '12px 0' }}>
        <div style={{ width: '100%', maxWidth: '1100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
          <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={{ height: 35 }} />
          <div style={{ fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Sign out</div>
        </div>
      </nav>

      {/* CONTEÚDO PRINCIPAL CENTRALIZADO */}
      <main style={{ 
        maxWidth: "1100px", 
        margin: "40px auto", 
        padding: "0 20px",
        display: "grid",
        gridTemplateColumns: "1fr 350px", // Coluna principal e lateral
        gap: "40px"
      }}>
        
        {/* LADO ESQUERDO: INFOS DA COMUNIDADE */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Header da Comunidade */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: 100, height: 100, borderRadius: 15, background: '#ccc', overflow: 'hidden' }}>
              <img src="URL_DA_LOGO_DO_SUPABASE" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <span style={{ fontSize: 12, fontWeight: 700, color: STYLES.accent }}>PROFESSIONAL AGENCY</span>
              <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0 }}>Ez Marketing Agencies 2</h1>
            </div>
          </div>

          {/* VÍDEO E ABOUT (Container 8 e 11) */}
          <div style={{ background: STYLES.white, padding: '30px', borderRadius: '25px', border: `1px solid ${STYLES.border}` }}>
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Introduction</h3>
            
            {/* VÍDEO CENTRALIZADO E PROPORCIONAL */}
            <div style={{ 
              position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '15px', background: '#000' 
            }}>
              <iframe 
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                src="https://www.youtube.com/embed/dQw4w9WgXcQ" // Dinâmico via youtube_video ID
                frameBorder="0" allowFullScreen 
              />
            </div>

            <div style={{ marginTop: 25 }}>
              <p style={{ fontSize: 15, lineHeight: '1.6' }}>
                {/* Nó -about */}
                Esta é a descrição oficial vinda do nó "about". Ela explica o propósito da comunidade de forma clara.
              </p>
              <a href="#" style={{ color: STYLES.accent, fontWeight: 600 }}>Visit Website</a>
            </div>
          </div>
        </section>

        {/* LADO DIREITO: SIDEBAR DE AÇÃO (Container 2) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          {/* CARD DE APLICAÇÃO */}
          <div style={{ 
            background: STYLES.white, padding: '30px', borderRadius: '25px', border: `1px solid ${STYLES.border}`,
            boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
          }}>
            <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 15 }}>Apply to join</h4>
            <TextArea 
              rows={5} 
              placeholder="Why do you want to join this community?" 
              style={{ borderRadius: '12px', padding: '12px', marginBottom: '20px' }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <AntdButton 
              type="primary" 
              block 
              onClick={handleInvite}
              loading={loading}
              style={{ background: STYLES.accent, borderColor: STYLES.accent, height: 50, borderRadius: '12px', fontWeight: 600 }}
            >
              SEND INVITE
            </AntdButton>
          </div>

          {/* RATINGS (Container 9) */}
          <div style={{ background: STYLES.white, padding: '20px', borderRadius: '25px', textAlign: 'center', border: `1px solid ${STYLES.border}` }}>
             <AntdRate disabled defaultValue={4.5} style={{ color: STYLES.accent }} />
             <div style={{ marginTop: 8, fontSize: 12 }}>
               <strong>128</strong> avaliações de empresas
             </div>
          </div>

          {/* METAS (Nó Goals Sum) */}
          <div style={{ 
            background: STYLES.cardGradient, 
            padding: '25px', 
            borderRadius: '70px', 
            border: `4px solid ${STYLES.border}`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: STYLES.accent }}>850+</div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>Objetivos Alcançados</div>
          </div>
        </aside>

      </main>
    </div>
  );
}
