import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// --- ÍCONES E ASSETS (Caminhos validados pelo PlasmicAApplyToACommunity.tsx) ---
import SemTitulo1SvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SemTitulo1Svg";
import CheckSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__CheckSvg";
import Icon38Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon38";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";

// --- COMPONENTES DINÂMICOS (Evita erros de Hydration e Build no Vercel) ---
const Slider = dynamic<any>(() => import("react-slick").then(m => m.default), { ssr: false });
const YouTube = dynamic<any>(() => import("react-youtube").then(m => m.default), { ssr: false });
const AntdButton = dynamic<any>(() => import("antd").then(m => m.Button), { ssr: false });
const AntdRate = dynamic<any>(() => import("antd").then(m => m.Rate), { ssr: false });
const AntdPopover = dynamic<any>(() => import("antd").then(m => m.Popover), { ssr: false });

// --- TYPES ---
interface ExpertTagProps {
  id: string;
  title: string;
  active?: boolean;
}

/**
 * PÁGINA: AApplyToACommunity
 * Esta página foi reconstruída para ser resiliente a erros de deploy,
 * mantendo a densidade de código e funcionalidades solicitadas.
 */
export default function AApplyToACommunity() {
  const router = useRouter();

  // --- ESTADOS DE UI ---
  const [shortMessage, setShortMessage] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("about");
  const [communityRating, setCommunityRating] = React.useState(4.5);

  // --- CONFIGURAÇÕES DOS CARROSÉIS ---
  const memberSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 800, settings: { slidesToShow: 1 } }
    ]
  };

  const partnerSliderSettings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    speed: 10000,
    slidesToShow: 5,
    infinite: true,
    pauseOnHover: false
  };

  // --- HANDLERS ---
  const handleInviteSubmit = async () => {
    if (!shortMessage.trim()) return alert("Please enter a message.");
    setIsInviting(true);
    try {
      // Simulação de Integração Supabase/API
      await new Promise(res => setTimeout(res, 2000));
      alert("Invitation sent successfully!");
      setShortMessage("");
    } catch (err) {
      console.error(err);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div style={s.root}>
      <Head>
        <title>Apply to a Community | EZ Marketing</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* 🟢 TOPBAR (Padding 229px - Identidade Visual Plasmic) */}
      <header id="topBar" style={s.topBar}>
        <div style={s.topBarContent}>
          <div id="logoContainer" onClick={() => router.push("/")} style={s.logoWrapper}>
            <img 
              src="/plasmic/ez_marketing_platform/images/logoPng2.png" 
              style={s.logo} 
              alt="EZ Marketing" 
            />
          </div>

          <nav style={s.navLinks}>
            <NavLink href="/a-service-dashboard">Service Dashboard</NavLink>
            <NavLink href="/a-community-dashboard">Community Dashboard</NavLink>
            <NavLink href="/market-trends">Market Trends</NavLink>
            <NavLink href="/a-find-a-business" active>Find a business</NavLink>
            
            <AntdPopover content={<div>User Profile Settings</div>} trigger="hover">
              <div id="popover26" style={s.profileTrigger}>
                <div style={s.avatarWrapper}>
                  <div style={s.avatarPlaceholder} />
                  <div style={s.onlineBadge} />
                </div>
                <ChevronDownSvgIcon style={s.chevronIcon} />
              </div>
            </AntdPopover>
          </nav>
        </div>
      </header>

      {/* 🔵 MAIN CONTENT */}
      <main style={s.mainWrapper}>
        
        {/* SECTION HERO: Grid 2 Colunas (Info + Invite) */}
        <section id="heroSection" style={s.heroGrid}>
          
          {/* NÓ: container3 (Comunidade e Membros) */}
          <div id="container3" style={s.glassCard}>
            <div style={s.communityHeader}>
              <div id="communityLogo" style={s.mainAvatarFrame}>
                <SemTitulo1SvgIcon style={{ width: "60%", height: "60%", color: "#74b924" }} />
              </div>
              <div style={s.communityInfo}>
                <h1 style={s.titleText}>Innovation Hub Community</h1>
                <div style={s.badgeRow}>
                  <span style={s.tagGold}>GOLD MEMBER</span>
                  <span style={s.tagVerified}>
                    <CheckSvgIcon style={{ width: 12, marginRight: 5 }} /> Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Dash de Métricas Rápidas */}
            <div style={s.metricsRow}>
              <div id="communityRate" style={s.metricBox}>
                <span style={s.metricLabel}>Community Performance</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <div id="rateSum" style={s.metricValue}>U$ 45,900.00</div>
                  <span style={s.trendUp}>+15.2%</span>
                </div>
                <AntdRate disabled defaultValue={4.5} style={s.rateStars} />
              </div>

              <div id="goalsSum" style={s.metricBoxSpecial}>
                <span style={s.metricLabel}>Active Projects</span>
                <div style={s.metricValueLarge}>14 / 20</div>
                <div style={s.progressContainer}>
                  <div style={{ ...s.progressFill, width: '70%' }} />
                </div>
              </div>
            </div>

            {/* NÓ: sliderCarousel (Membros) */}
            <div id="sliderCarousel" style={s.carouselSection}>
              <h3 style={s.subTitle}>Featured Members</h3>
              <Slider {...memberSliderSettings}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={s.slideItem}>
                    <div style={s.memberCard}>
                      <div style={s.memberAvatar} />
                      <div style={s.memberName}>Expert Pro {i}</div>
                      <div style={s.memberRole}>Senior Strategist</div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* NÓ: container2 (Card de Convite/Formulário) */}
          <div id="container2" style={s.formCard}>
            <div style={s.formHeader}>
              <h2 style={s.formTitle}>Join this Hub</h2>
              <p style={s.formDesc}>
                Tell the community managers why you are a great fit for their upcoming projects.
              </p>
            </div>

            <div style={s.inputGroup}>
              <label style={s.label}>Your Proposal</label>
              <textarea 
                id="shortMessage"
                value={shortMessage}
                onChange={(e) => setShortMessage(e.target.value)}
                placeholder="If you are excited about working with this community, please enter a short message here and click 'Invite'"
                style={s.textArea}
              />
            </div>

            <AntdButton 
              id="inviteButon"
              type="primary"
              loading={isInviting}
              onClick={handleInviteSubmit}
              style={s.inviteBtn}
            >
              INVITE TO COLLABORATE
            </AntdButton>

            <div style={s.formFooter}>
              <span>Looking to build your own?</span>
              <Link href="/a-create-community" style={s.greenLink}>Create a Community</Link>
            </div>
          </div>
        </section>

        {/* SECTION: Partners Slider (container10 / sliderCarousel2) */}
        <section id="container10" style={s.partnersSection}>
          <h4 style={s.partnerTitle}>CONNECTED COMPANIES & PARTNERS</h4>
          <div id="sliderCarousel2" style={s.partnerSliderWrapper}>
            <Slider {...partnerSliderSettings}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} style={s.partnerLogoItem}>
                  <div style={s.partnerLogoBox}>
                    <Icon38Icon style={{ width: 24, marginRight: 10 }} />
                    <span>Partner_{i}</span>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* SECTION: Experts & Capabilities (container11) */}
        <section id="container11" style={s.expertsSection}>
          <div style={s.expertsHeader}>
            <h2 style={s.sectionTitle}>Main Capabilities</h2>
            <div style={s.searchBar}>
              <SearchSvgIcon style={{ width: 16, color: "#999" }} />
              <input type="text" placeholder="Search skills..." style={s.searchInternal} />
            </div>
          </div>

          <div style={s.tagCloud}>
            <ExpertTag id="popover21" title="Visual Content Creation" active />
            <ExpertTag id="popover22" title="Performance Marketing" />
            <ExpertTag id="popover23" title="Web3 Development" active />
            <ExpertTag id="popover24" title="Strategic Planning" />
            <ExpertTag id="popover25" title="Community Management" active />
            <ExpertTag id="popover26" title="SEO / SEM" />
            <ExpertTag id="popover27" title="UX/UI Design" />
            <ExpertTag id="popover28" title="Data Analysis" active />
          </div>
        </section>

        {/* SECTION: Tabs Details */}
        <section style={s.tabsSection}>
          <div style={s.tabBar}>
            <button onClick={() => setActiveTab("about")} style={activeTab === "about" ? s.activeTab : s.inactiveTab}>About</button>
            <button onClick={() => setActiveTab("website")} style={activeTab === "website" ? s.activeTab : s.inactiveTab}>Website</button>
          </div>
          
          <div style={s.tabContent}>
            {activeTab === "about" ? (
              <div id="about" style={s.tabPane}>
                <p>We are a powerhouse of creative and technical experts. Our focus is to provide end-to-end digital solutions for scaling businesses. By joining us, you gain access to high-ticket clients and a network of professionals that value quality above all else.</p>
              </div>
            ) : (
              <div id="website" style={s.tabPane}>
                <a href="https://ezmarketing.space" target="_blank" rel="noopener noreferrer" style={s.extLink}>
                  https://www.innovation-hub-ez.space
                </a>
              </div>
            )}
          </div>
        </section>

        {/* SECTION: Video (youtubeVideo) */}
        <section id="youtubeVideo" style={s.videoSection}>
          <div style={s.videoContainer}>
            <YouTube 
              videoId="dQw4w9WgXcQ" 
              opts={{ width: "100%", height: "500px", playerVars: { autoplay: 0 } }} 
            />
          </div>
        </section>

      </main>

      <footer style={s.footer}>
        <div style={s.footerContent}>
          <p>© 2024 EZ Marketing Platform - All rights reserved.</p>
          <div style={s.footerLinks}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENTES ---

function ExpertTag({ id, title, active }: ExpertTagProps) {
  return (
    <div 
      id={id} 
      style={{
        ...s.tagBase,
        background: active ? "#74b924" : "#ffffff",
        color: active ? "#fff" : "#666",
        border: active ? "1px solid #74b924" : "1px solid #ddd"
      }}
    >
      {active && <CheckSvgIcon style={{ width: 12, marginRight: 8 }} />}
      {title}
    </div>
  );
}

function NavLink({ href, children, active = false }: any) {
  return (
    <Link href={href} style={{
      ...s.navItem,
      color: active ? "#000" : "#666",
      fontWeight: active ? 700 : 500,
      borderBottom: active ? "3px solid #74b924" : "3px solid transparent"
    }}>
      {children}
    </Link>
  );
}

// --- ESTILOS (CSS-IN-JS) ---
const s: Record<string, React.CSSProperties> = {
  root: { background: "#f8f7f5", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  topBar: { width: "100%", height: "90px", background: "#fff", borderBottom: "1px solid #eaeaea", position: "sticky", top: 0, zIndex: 100, display: "flex", justifyContent: "center" },
  topBarContent: { width: "100%", maxWidth: "1440px", padding: "0 229px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoWrapper: { cursor: "pointer" },
  logo: { height: "40px" },
  navLinks: { display: "flex", gap: "30px", alignItems: "center" },
  navItem: { textDecoration: "none", fontSize: "14px", padding: "34px 0", transition: "0.2s" },
  profileTrigger: { display: "flex", alignItems: "center", gap: "10px", background: "#f0f0f0", padding: "5px 12px", borderRadius: "30px" },
  avatarWrapper: { position: "relative" },
  avatarPlaceholder: { width: "32px", height: "32px", borderRadius: "50%", background: "#ccc" },
  onlineBadge: { width: "10px", height: "10px", background: "#4ade80", borderRadius: "50%", position: "absolute", bottom: 0, right: 0, border: "2px solid #fff" },
  chevronIcon: { width: "12px", color: "#888" },

  mainWrapper: { maxWidth: "1440px", margin: "0 auto", padding: "40px 229px" },
  heroGrid: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", marginBottom: "40px" },
  glassCard: { background: "#fff", borderRadius: "24px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" },
  communityHeader: { display: "flex", gap: "20px", alignItems: "center", marginBottom: "35px" },
  mainAvatarFrame: { width: "100px", height: "100px", background: "#f9f9f9", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" },
  communityInfo: { display: "flex", flexDirection: "column", gap: "5px" },
  titleText: { fontSize: "26px", fontWeight: 800, margin: 0 },
  badgeRow: { display: "flex", gap: "10px" },
  tagGold: { background: "linear-gradient(135deg, #d4af37, #f9e29c)", color: "#5c4300", padding: "3px 10px", borderRadius: "5px", fontSize: "10px", fontWeight: 700 },
  tagVerified: { background: "#e8f5e9", color: "#2e7d32", padding: "3px 10px", borderRadius: "5px", fontSize: "10px", display: "flex", alignItems: "center" },

  metricsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" },
  metricBox: { background: "#fafafa", padding: "20px", borderRadius: "16px", border: "1px solid #f0f0f0" },
  metricBoxSpecial: { 
    background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)", 
    padding: "20px", borderRadius: "16px", border: "3px solid #0000000a" 
  },
  metricLabel: { fontSize: "12px", color: "#999", display: "block", marginBottom: "5px" },
  metricValue: { fontSize: "22px", fontWeight: 700 },
  metricValueLarge: { fontSize: "28px", fontWeight: 800 },
  trendUp: { color: "#4caf50", fontSize: "12px", fontWeight: 600 },
  rateStars: { fontSize: "14px" },
  progressContainer: { width: "100%", height: "6px", background: "#eee", borderRadius: "10px", marginTop: "10px" },
  progressFill: { height: "100%", background: "#000", borderRadius: "10px" },

  carouselSection: { marginTop: "30px" },
  subTitle: { fontSize: "16px", fontWeight: 700, marginBottom: "20px" },
  slideItem: { padding: "0 10px" },
  memberCard: { textAlign: "center", background: "#fcfcfc", padding: "20px", borderRadius: "16px", border: "1px solid #f5f5f5" },
  memberAvatar: { width: "60px", height: "60px", background: "#ddd", borderRadius: "50%", margin: "0 auto 10px" },
  memberName: { fontSize: "13px", fontWeight: 600 },
  memberRole: { fontSize: "11px", color: "#999" },

  formCard: { background: "#fff", borderRadius: "24px", padding: "40px", height: "fit-content", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" },
  formHeader: { marginBottom: "30px" },
  formTitle: { fontSize: "22px", fontWeight: 700, margin: "0 0 10px" },
  formDesc: { fontSize: "14px", color: "#777", lineHeight: "1.5" },
  inputGroup: { marginBottom: "25px" },
  label: { fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "8px" },
  textArea: { width: "100%", height: "150px", borderRadius: "12px", border: "1px solid #ddd", padding: "15px", fontSize: "14px", resize: "none", outline: "none", background: "#fdfdfd" },
  inviteBtn: { width: "100%", height: "55px", borderRadius: "12px", background: "#74b924", border: "none", fontWeight: 700, fontSize: "15px" },
  formFooter: { marginTop: "20px", textAlign: "center", fontSize: "13px", color: "#999" },
  greenLink: { color: "#74b924", fontWeight: 600, marginLeft: "5px", textDecoration: "none" },

  partnersSection: { marginBottom: "50px", background: "#fff", padding: "30px", borderRadius: "24px" },
  partnerTitle: { fontSize: "12px", color: "#bbb", letterSpacing: "1px", textAlign: "center", marginBottom: "25px" },
  partnerSliderWrapper: { width: "100%" },
  partnerLogoItem: { padding: "0 20px" },
  partnerLogoBox: { display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", opacity: 0.6 },

  expertsSection: { marginBottom: "50px" },
  expertsHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  sectionTitle: { fontSize: "20px", fontWeight: 800, margin: 0 },
  searchBar: { display: "flex", alignItems: "center", gap: "10px", background: "#fff", padding: "8px 15px", borderRadius: "10px", border: "1px solid #eee" },
  searchInternal: { border: "none", outline: "none", fontSize: "13px", width: "150px" },
  tagCloud: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tagBase: { padding: "10px 20px", borderRadius: "30px", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", cursor: "default", transition: "0.2s" },

  tabsSection: { marginBottom: "50px" },
  tabBar: { display: "flex", gap: "30px", borderBottom: "1px solid #ddd" },
  activeTab: { background: "none", border: "none", padding: "15px 0", fontSize: "15px", fontWeight: 700, color: "#000", borderBottom: "2px solid #000", cursor: "pointer" },
  inactiveTab: { background: "none", border: "none", padding: "15px 0", fontSize: "15px", color: "#999", cursor: "pointer" },
  tabContent: { padding: "25px 0" },
  tabPane: { fontSize: "15px", lineHeight: "1.8", color: "#555" },
  extLink: { color: "#74b924", textDecoration: "underline" },

  videoSection: { width: "100%", borderRadius: "24px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" },
  videoContainer: { background: "#000" },

  footer: { borderTop: "1px solid #ddd", padding: "40px 0", marginTop: "60px" },
  footerContent: { maxWidth: "1440px", margin: "0 auto", padding: "0 229px", display: "flex", justifyContent: "space-between", color: "#aaa", fontSize: "12px" },
  footerLinks: { display: "flex", gap: "20px" }
};
