import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// --- ÍCONES E ASSETS (Extraídos do PlasmicAApplyToACommunity.tsx) ---
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";
import SemTitulo1SvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SemTitulo1Svg";
import Icon38Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon38";
import Icon37Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon37";
import Icon3Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon3";
import ChecksvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Checksvg";

// --- COMPONENTES DINÂMICOS (Padrão Ouro para evitar erros de Build no Vercel) ---
const Slider = dynamic<any>(() => import("react-slick").then(m => m.default), { ssr: false });
const AntdButton = dynamic<any>(() => import("antd").then(m => m.Button), { ssr: false });
const AntdDropdown = dynamic<any>(() => import("antd").then(m => m.Dropdown), { ssr: false });
const AntdMenu = dynamic<any>(() => import("antd").then(m => m.Menu), { ssr: false });
const AntdTextArea = dynamic<any>(() => import("antd").then(m => m.Input.then(i => i.TextArea)), { ssr: false });
const YouTube = dynamic<any>(() => import("react-youtube").then(m => m.default), { ssr: false });

// --- TYPES INTERNOS ---
interface ExpertTagProps {
  id: string;
  title: string;
  active?: boolean;
}

export default function AApplyToACommunity() {
  const router = useRouter();

  // Estados de UI e Form
  const [shortMessage, setShortMessage] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("about");

  // Configurações do Slider de Membros (Visual Slick)
  const memberSliderSettings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  // Handlers
  const handleInvite = async () => {
    setIsInviting(true);
    // Simulação de delay de rede para Supabase
    setTimeout(() => {
      console.log("Mensagem enviada:", shortMessage);
      setIsInviting(false);
      alert("Application sent successfully!");
    }, 1500);
  };

  return (
    <div style={s.root}>
      <Head>
        <title>Apply to a Community | EZ Marketing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 🟢 TOPBAR: Fiel ao design original (Padding 229px) */}
      <header id="topBar" style={s.topBar}>
        <div style={s.topBarContent}>
          <div id="logoContainer" onClick={() => router.push("/")} style={{ cursor: "pointer" }}>
            <img 
              src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" 
              style={s.logo} 
              alt="EZ Marketing Logo" 
            />
          </div>

          <nav style={s.navLinks}>
            <NavLink id="popover7" href="/service-dashboard">Service Dashboard</NavLink>
            <NavLink id="popover8" href="/community-dashboard">Community Dashboard</NavLink>
            <NavLink id="popover9" href="/market-trends">Market Trends</NavLink>
            <NavLink id="popover10" href="/find-a-business" active>Find a business</NavLink>
            
            <div id="popover26" style={s.profileTrigger}>
              <div style={s.avatarWrapper}>
                <div style={s.avatarPlaceholder} />
                <div style={s.onlineBadge} />
              </div>
              <ChevronDownSvgIcon style={s.chevronIcon} />
            </div>
          </nav>
        </div>
      </header>

      {/* 🔵 CONTEÚDO PRINCIPAL */}
      <main style={s.mainWrapper}>
        
        {/* SECTION HERO: Grid 2 Colunas (Info + Invite) */}
        <section id="heroSection" style={s.heroGrid}>
          
          {/* NÓ: container3 (Dados da Comunidade) */}
          <div id="container3" style={s.glassCard}>
            <div style={s.communityProfileHeader}>
              <div id="communityLogo" style={s.mainAvatarFrame}>
                <SemTitulo1SvgIcon style={{ width: "60%", height: "60%" }} />
              </div>
              <div style={s.communityTitles}>
                <h1 style={s.communityTitleText}>Creative Builders Community</h1>
                <div style={s.badgeRow}>
                  <span style={s.tagGold}>GOLD MEMBER</span>
                  <span style={s.tagVerified}><ChecksvgIcon style={{width: 10}} /> Verified</span>
                </div>
              </div>
            </div>

            <div style={s.statsContainer}>
              <div id="communityRate" style={s.statBox}>
                <span style={s.statLabel}>Community Rate</span>
                <div id="rateSum" style={s.statValue}>U$ 12,450.00</div>
                <span style={s.statSubText}>+12% this month</span>
              </div>

              <div id="goalsSum" style={s.statBoxSpecial}>
                <span style={s.statLabel}>Goals Reached</span>
                <div style={s.statValueLarge}>18/20</div>
                <div style={s.progressBar}><div style={{...s.progressFill, width: '90%'}} /></div>
              </div>
            </div>

            {/* SLIDER DE MEMBROS */}
            <div id="sliderCarousel" style={s.sliderWrapper}>
              <h3 style={s.sliderTitle}>Active Members</h3>
              <Slider {...memberSliderSettings}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} style={s.memberSlideItem}>
                    <div style={s.memberAvatarCircle} />
                    <div style={s.memberName}>Member {i}</div>
                    <div style={s.memberRole}>Expert</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* NÓ: container2 (Card de Convite/Formulário) */}
          <div id="container2" style={s.inviteCard}>
            <div style={s.inviteHeader}>
              <h3 style={s.inviteTitle}>Apply to Join</h3>
              <p style={s.inviteDescription}>
                Submit your application to collaborate with this community. 
                Our managers will review your profile shortly.
              </p>
            </div>
            
            <div style={s.formGroup}>
              <label style={s.label}>Your Proposal / Message</label>
              <AntdTextArea 
                id="shortMessage"
                value={shortMessage}
                onChange={(e: any) => setShortMessage(e.target.value)}
                placeholder="Write a brief message explaining why you want to join..."
                style={s.textAreaCustom}
                rows={8}
              />
            </div>

            <AntdButton 
              id="inviteButon"
              type="primary"
              loading={isInviting}
              onClick={handleInvite}
              style={s.primaryBtn}
            >
              SEND INVITATION
            </AntdButton>

            <div style={s.inviteFooter}>
              <p>Don't have a community yet?</p>
              <Link href="/create-community" style={s.textLink}>Create your own community</Link>
            </div>
          </div>
        </section>

        {/* SECTION TABS: About / Website / Experts */}
        <section style={s.detailsSection}>
          <div style={s.tabsHeader}>
            <button onClick={() => setActiveTab("about")} style={activeTab === "about" ? s.tabBtnActive : s.tabBtn}>About</button>
            <button onClick={() => setActiveTab("website")} style={activeTab === "website" ? s.tabBtnActive : s.tabBtn}>Website</button>
            <button onClick={() => setActiveTab("experts")} style={activeTab === "experts" ? s.tabBtnActive : s.tabBtn}>Experts</button>
          </div>

          <div style={s.tabContent}>
            {activeTab === "about" && (
              <div id="about" style={s.tabPane}>
                <p>This community focuses on high-end marketing strategies and digital production. We gather the best talents to deliver scalable results for global brands.</p>
              </div>
            )}
            {activeTab === "website" && (
              <div id="website" style={s.tabPane}>
                <a href="https://ezmarketing.space" target="_blank" style={s.websiteLink}>www.ezmarketing.space</a>
              </div>
            )}
          </div>
        </section>

        {/* SECTION EXPERTS: container11 */}
        <section id="container11" style={s.expertsGridSection}>
          <div style={s.sectionHeaderRow}>
            <h2 style={s.sectionTitleText}>Experts & Capabilities</h2>
            <div style={s.filterBadge}>View All</div>
          </div>
          <div style={s.tagsContainer}>
            <ExpertTag id="popover21" title="Service Scheduling" active />
            <ExpertTag id="popover22" title="Influencer Marketing" />
            <ExpertTag id="popover23" title="Commercial Production" active />
            <ExpertTag id="popover24" title="Performance Campaign" />
            <ExpertTag id="popover25" title="Digital Experiences" />
            <ExpertTag id="popover26" title="SEO Strategy" />
            <ExpertTag id="popover27" title="Content Creation" />
          </div>
        </section>

        {/* SECTION VIDEO: youtubeVideo */}
        <section id="youtubeVideo" style={s.videoWrapper}>
          <div style={s.videoInner}>
             <YouTube 
                videoId="dQw4w9WgXcQ" 
                opts={{ 
                  width: '100%', 
                  height: '540px',
                  playerVars: { autoplay: 0 } 
                }} 
             />
          </div>
        </section>

      </main>

      {/* FOOTER SIMPLES */}
      <footer style={s.footer}>
        <p>© 2024 EZ Marketing Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}

// --- COMPONENTES AUXILIARES ---

function ExpertTag({ id, title, active }: ExpertTagProps) {
  return (
    <div 
      id={id} 
      style={{
        ...s.expertTagBase,
        background: active ? "#74b924" : "#4a4a4a",
        border: active ? "2px solid #5d941d" : "2px solid transparent"
      }}
    >
      {active && <ChecksvgIcon style={{ width: 12, marginRight: 8 }} />}
      {title}
    </div>
  );
}

function NavLink({ id, href, children, active = false }: any) {
  return (
    <Link id={id} href={href} style={{
      ...s.navItemBase,
      color: active ? "#000000" : "#6b6b6b",
      fontWeight: active ? 700 : 500,
      borderBottom: active ? "2px solid #74b924" : "2px solid transparent"
    }}>
      {children}
    </Link>
  );
}

// --- ESTILIZAÇÃO COMPLETA (CSS-IN-JS) ---
// Extraído e otimizado dos arquivos .module.css fornecidos

const s: Record<string, React.CSSProperties> = {
  root: { 
    background: "#f4f3f0", 
    minHeight: "100vh", 
    fontFamily: "'Inter', sans-serif",
    color: "#1a1a1a"
  },
  topBar: {
    width: "100%",
    background: "#ffffff",
    height: "90px",
    display: "flex",
    justifyContent: "center",
    borderBottom: "1px solid #e0e0e0",
    position: "sticky",
    top: 0,
    zIndex: 1000
  },
  topBarContent: {
    width: "100%",
    maxWidth: "1440px",
    padding: "0 229px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: { height: "45px", width: "auto" },
  navLinks: { display: "flex", alignItems: "center", gap: "32px" },
  navItemBase: { 
    textDecoration: "none", 
    fontSize: "15px", 
    padding: "8px 0",
    transition: "all 0.2s ease"
  },
  profileTrigger: { 
    display: "flex", 
    alignItems: "center", 
    gap: "12px", 
    background: "#f8f9fa",
    padding: "6px 12px",
    borderRadius: "50px",
    cursor: "pointer",
    border: "1px solid #eee"
  },
  avatarWrapper: { position: "relative" },
  avatarPlaceholder: { width: "38px", height: "38px", borderRadius: "50%", background: "#d1d1d1" },
  onlineBadge: { 
    width: "10px", height: "10px", background: "#4ade80", 
    borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid #fff" 
  },
  chevronIcon: { width: "12px", color: "#666" },

  mainWrapper: { 
    maxWidth: "1440px", 
    margin: "0 auto", 
    padding: "40px 229px" 
  },
  heroGrid: { 
    display: "grid", 
    gridTemplateColumns: "1.2fr 0.8fr", 
    gap: "30px",
    marginBottom: "50px"
  },
  glassCard: { 
    background: "#ffffff", 
    borderRadius: "32px", 
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #fff"
  },
  communityProfileHeader: { display: "flex", gap: "25px", alignItems: "center", marginBottom: "40px" },
  mainAvatarFrame: { 
    width: "110px", height: "110px", background: "#f0f2f5", 
    borderRadius: "28px", display: "flex", alignItems: "center", justifyContent: "center" 
  },
  communityTitles: { display: "flex", flexDirection: "column", gap: "8px" },
  communityTitleText: { fontSize: "28px", fontWeight: 800, margin: 0, letterSpacing: "-0.5px" },
  badgeRow: { display: "flex", gap: "10px" },
  tagGold: { 
    background: "linear-gradient(135deg, #d4af37 0%, #f9e29c 100%)",
    color: "#5c4300", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 
  },
  tagVerified: { background: "#e8f5e9", color: "#2e7d32", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", display: "flex", alignItems: "center", gap: "5px" },

  statsContainer: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" },
  statBox: { background: "#fafafa", padding: "25px", borderRadius: "20px", border: "1px solid #f0f0f0" },
  statBoxSpecial: { 
    background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
    padding: "25px", borderRadius: "20px", border: "4px solid #00000017",
    boxShadow: "inset 0 0 20px rgba(255,255,255,0.5)"
  },
  statLabel: { fontSize: "13px", color: "#888", fontWeight: 500, display: "block", marginBottom: "8px" },
  statValue: { fontSize: "24px", fontWeight: 700, color: "#1a1a1a" },
  statValueLarge: { fontSize: "32px", fontWeight: 900, color: "#000" },
  statSubText: { fontSize: "11px", color: "#4caf50", fontWeight: 600 },
  progressBar: { width: "100%", height: "6px", background: "#eee", borderRadius: "10px", marginTop: "12px" },
  progressFill: { height: "100%", background: "#000", borderRadius: "10px" },

  sliderWrapper: { marginTop: "20px" },
  sliderTitle: { fontSize: "16px", fontWeight: 700, marginBottom: "20px" },
  memberSlideItem: { textAlign: "center", outline: "none" },
  memberAvatarCircle: { width: "70px", height: "70px", borderRadius: "50%", background: "#eee", margin: "0 auto 12px", border: "3px solid #fff", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
  memberName: { fontSize: "14px", fontWeight: 600 },
  memberRole: { fontSize: "12px", color: "#999" },

  inviteCard: { 
    background: "#ffffff", 
    borderRadius: "32px", 
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    display: "flex", 
    flexDirection: "column",
    height: "fit-content"
  },
  inviteTitle: { fontSize: "22px", fontWeight: 700, margin: "0 0 12px" },
  inviteDescription: { fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "30px" },
  formGroup: { marginBottom: "25px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#444", display: "block", marginBottom: "10px" },
  textAreaCustom: { 
    borderRadius: "16px", padding: "15px", border: "1px solid #e0e0e0", 
    background: "#fcfcfc", fontSize: "14px", transition: "all 0.3s ease" 
  },
  primaryBtn: { 
    height: "55px", borderRadius: "16px", background: "#74b924", border: "none",
    fontSize: "16px", fontWeight: 700, color: "#fff", cursor: "pointer",
    boxShadow: "0 8px 20px rgba(116, 185, 36, 0.3)"
  },
  inviteFooter: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#888" },
  textLink: { color: "#74b924", fontWeight: 600, textDecoration: "none", marginLeft: "5px" },

  detailsSection: { marginBottom: "50px" },
  tabsHeader: { display: "flex", gap: "40px", borderBottom: "1px solid #e0e0e0", marginBottom: "25px" },
  tabBtn: { background: "none", border: "none", padding: "10px 0", fontSize: "16px", color: "#888", cursor: "pointer" },
  tabBtnActive: { background: "none", border: "none", padding: "10px 0", fontSize: "16px", color: "#000", fontWeight: 700, borderBottom: "2px solid #000", cursor: "pointer" },
  tabPane: { fontSize: "15px", color: "#555", lineHeight: "1.8" },
  websiteLink: { color: "#0066ff", textDecoration: "underline" },

  expertsGridSection: { marginBottom: "60px" },
  sectionHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  sectionTitleText: { fontSize: "24px", fontWeight: 800, margin: 0 },
  filterBadge: { padding: "6px 16px", background: "#fff", border: "1px solid #ddd", borderRadius: "50px", fontSize: "12px", cursor: "pointer" },
  tagsContainer: { display: "flex", flexWrap: "wrap", gap: "12px" },
  expertTagBase: { 
    padding: "12px 24px", borderRadius: "50px", color: "#fff", 
    fontSize: "14px", fontWeight: 500, display: "flex", alignItems: "center",
    transition: "transform 0.2s ease", cursor: "default"
  },

  videoWrapper: { width: "100%", borderRadius: "40px", overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.15)" },
  videoInner: { width: "100%", background: "#000" },
  footer: { textAlign: "center", padding: "40px 0", color: "#aaa", fontSize: "13px" }
};
