import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// ✅ ÍCONES E ASSETS (Mantendo os nomes dos nós originais)
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";
import SemTitulo1SvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SemTitulo1Svg";

// ✅ CORREÇÃO DAS IMPORTAÇÕES DINÂMICAS
const Slider = dynamic(() => import("react-slick"), { ssr: false });
const AntdButton = dynamic(() => import("antd").then(m => m.Button), { ssr: false });
const AntdDropdown = dynamic(() => import("antd").then(m => m.Dropdown), { ssr: false });
// Importando o TextArea diretamente para evitar o erro de propriedade inexistente
const AntdTextArea = dynamic(() => import("antd").then(m => m.Input.TextArea), { ssr: false });
const YouTube = dynamic(() => import("react-youtube"), { ssr: false });

export default function AApplyToACommunity() {
  const router = useRouter();

  // ✅ ESTADOS PARA CONTROLE DO SUPABASE (Liberdade total)
  const [shortMessage, setShortMessage] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);

  const memberSliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true
  };

  return (
    <div style={s.root}>
      <Head>
        <title>Apply to a Community | EZ Marketing</title>
      </Head>

      {/* 🟢 NÓ: topBar - Com o padding de 229px extraído do CSS */}
      <header id="topBar" style={s.topBar}>
        <img src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" style={s.logo} alt="EZ Logo" />
        
        <div style={s.navLinks}>
          <NavLink id="popover7" href="/service-dashboard">Service Dashboard</NavLink>
          <NavLink id="popover8" href="/community-dashboard">Community Dashboard</NavLink>
          <NavLink id="popover9" href="/market-trends">Market Trends</NavLink>
          <NavLink id="popover10" href="/find-a-business" active>Find a business</NavLink>
          
          <div id="popover26" style={s.profileTrigger}>
            <div style={s.avatarPlaceholder} />
            <ChevronDownSvgIcon style={{ width: 12 }} />
          </div>
        </div>
      </header>

      <main style={s.mainContainer}>
        <section style={s.heroSection}>
          
          {/* NÓ: container3 (Comunidade) */}
          <div id="container3" style={s.communityCard}>
            <div style={s.communityHeader}>
              <div id="communityLogo" style={s.largeAvatar}>
                <SemTitulo1SvgIcon style={{ width: 40 }} />
              </div>
              <div>
                <h2 style={s.communityName}>Community Name</h2>
                <span style={s.tagGold}>Gold</span>
              </div>
            </div>

            <div style={s.statsGrid}>
              <div id="communityRate" style={s.statBox}>
                <span style={s.statLabel}>Community Rate</span>
                <div id="rateSum" style={s.statValue}>U$ 0.00</div>
              </div>
              <div id="goalsSum" style={s.statBoxGlass}>
                <span style={s.statLabel}>Goals Reached</span>
                <div style={s.statValue}>0/0</div>
              </div>
            </div>

            {/* NÓ: sliderCarousel (Membros) */}
            <div id="sliderCarousel" style={{ marginTop: 20 }}>
              <Slider {...memberSliderSettings}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={s.memberSlide}>
                    <div style={s.memberAvatar} />
                    <div style={s.memberRole}>Market Manager</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* 🔴 NÓ: container2 (O Formulário que o Plasmic bloqueava) */}
          <div id="container2" style={s.formCard}>
            <p style={s.formText}>If you are excited about working with this community, please enter a short message here and click "Invite"</p>
            
            {/* CORREÇÃO AQUI: Usando o componente importado corretamente */}
            <AntdTextArea 
              id="shortMessage"
              value={shortMessage}
              onChange={(e) => setShortMessage(e.target.value)}
              placeholder="Your message..."
              style={s.textArea}
              rows={6}
            />

            <AntdButton 
              id="inviteButon"
              type="primary"
              loading={isInviting}
              onClick={() => setIsInviting(true)}
              style={s.inviteBtn}
            >
              Invite
            </AntdButton>
            <Link href="#" style={s.createLink}>Create a Community</Link>
          </div>
        </section>

        {/* 🔴 NÓ: container11 (A Seção de Especialistas que faltou) */}
        <section id="container11" style={s.expertsSection}>
          <h2 style={s.sectionTitle}>Experts & Capabilities</h2>
          <div style={s.expertGrid}>
            <ExpertTag id="popover21" title="Service Scheduling" />
            <ExpertTag id="popover22" title="Influencer Marketing" />
            <ExpertTag id="popover23" title="Commercial Production" />
            <ExpertTag id="popover24" title="Performance Campaign" />
            <ExpertTag id="popover25" title="Digital Experiences" />
          </div>
        </section>

        <section id="youtubeVideo" style={s.videoContainer}>
           <YouTube videoId="dQw4w9WgXcQ" opts={{ width: '100%', height: '500px' }} />
        </section>
      </main>
    </div>
  );
}

// ✅ COMPONENTES DE APOIO
function ExpertTag({ id, title }: { id: string, title: string }) {
  return (
    <div id={id} style={s.expertTag}>
      {title}
    </div>
  );
}

function NavLink({ id, href, children, active = false }: any) {
  return (
    <Link id={id} href={href} style={{
      ...s.navItem,
      fontWeight: active ? 700 : 400,
      color: active ? "#000" : "#535353"
    }}>{children}</Link>
  );
}

// ✅ ESTILIZAÇÃO BRUTAL (Fiel ao seu CSS/Docx)
const s: Record<string, React.CSSProperties> = {
  root: { background: "#e7e6e2", minHeight: "100vh", fontFamily: "Inter, sans-serif" },
  topBar: { 
    display: "flex", alignItems: "center", justifyContent: "space-between", 
    padding: "0 229px", height: 80, background: "#FFF", borderBottom: "1px solid #d1d1d1"
  },
  logo: { width: 174, height: 45, objectFit: "contain" },
  navLinks: { display: "flex", gap: 25, alignItems: "center" },
  navItem: { textDecoration: "none", fontSize: 14 },
  profileTrigger: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  avatarPlaceholder: { width: 35, height: 35, borderRadius: "50%", background: "#d9d9d9" },
  mainContainer: { padding: "40px 229px" },
  heroSection: { display: "grid", gridTemplateColumns: "1fr 400px", gap: 30, marginBottom: 50 },
  communityCard: { background: "#FFF", borderRadius: 24, padding: 30 },
  communityHeader: { display: "flex", gap: 20, alignItems: "center", marginBottom: 30 },
  largeAvatar: { width: 80, height: 80, borderRadius: 20, background: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" },
  communityName: { fontSize: 24, margin: 0 },
  tagGold: { background: "linear-gradient(90deg, #d4af37, #f9e29c)", padding: "4px 12px", borderRadius: 8, fontSize: 10, fontWeight: 700 },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 },
  statBox: { background: "#f8f9fa", padding: 20, borderRadius: 16, textAlign: "center" },
  statBoxGlass: { 
    background: "radial-gradient(ellipse at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
    padding: 20, borderRadius: 70, textAlign: "center", border: "4px solid #00000017" 
  },
  statLabel: { fontSize: 12, color: "#888", display: "block", marginBottom: 5 },
  statValue: { fontSize: 22, fontWeight: 800 },
  memberSlide: { padding: "0 10px", textAlign: "center" },
  memberAvatar: { width: 60, height: 60, borderRadius: "50%", background: "#eee", margin: "0 auto 10px" },
  memberRole: { fontSize: 10, color: "#888" },
  formCard: { background: "#FFF", borderRadius: 24, padding: 30, display: "flex", flexDirection: "column" },
  formText: { fontSize: 14, color: "#535353", marginBottom: 20 },
  textArea: { borderRadius: 12, marginBottom: 20 },
  inviteBtn: { height: 50, borderRadius: 12, background: "#74b924", border: "none", fontSize: 16, fontWeight: 700, color: "#fff" },
  createLink: { textAlign: "center", marginTop: 15, fontSize: 12, color: "#888", textDecoration: "none" },
  expertsSection: { marginTop: 40 },
  sectionTitle: { fontSize: 22, marginBottom: 25 },
  expertGrid: { display: "flex", flexWrap: "wrap", gap: 12 },
  expertTag: { padding: "10px 20px", background: "#666", color: "#FFF", borderRadius: 30, fontSize: 13 },
  videoContainer: { marginTop: 60, borderRadius: 30, overflow: "hidden" }
};
