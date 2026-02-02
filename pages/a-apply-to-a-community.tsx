import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// --- IMPORTAÇÃO DE ÍCONES (Validados pelo seu arquivo Plasmic) ---
import SemTitulo1SvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SemTitulo1Svg";
import CheckSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__CheckSvg";
import Icon38Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon38";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";
import SearchSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SearchSvg";
import Icon36Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon36";
import Icon13Icon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__Icon13";

// --- COMPONENTES DINÂMICOS (Configuração Robusta para Vercel) ---
const Slider = dynamic<any>(() => import("react-slick").then(m => m.default), { ssr: false });
const YouTube = dynamic<any>(() => import("react-youtube").then(m => m.default), { ssr: false });
const AntdButton = dynamic<any>(() => import("antd").then(m => m.Button), { ssr: false });
const AntdTextArea = dynamic<any>(() => import("antd").then(m => m.Input).then(i => i.TextArea), { ssr: false });
const AntdRate = dynamic<any>(() => import("antd").then(m => m.Rate), { ssr: false });
const AntdDropdown = dynamic<any>(() => import("antd").then(m => m.Dropdown), { ssr: false });
const AntdMenu = dynamic<any>(() => import("antd").then(m => m.Menu), { ssr: false });

/**
 * PÁGINA: AApplyToACommunity
 * Uma reconstrução completa baseada no código trunfo do Plasmic.
 */
export default function AApplyToACommunity() {
  const router = useRouter();

  // --- ESTADOS (BUSINESS LOGIC) ---
  const [shortMessage, setShortMessage] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("about");
  const [notifications, setNotifications] = React.useState(3);

  // --- CONFIGS DE CARROSÉIS (SLICK) ---
  const memberSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };

  const partnerSettings = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    speed: 3000,
    autoplaySpeed: 0,
    cssEase: "linear",
    pauseOnHover: false,
    arrows: false
  };

  // --- HANDLERS ---
  const onInviteClick = async () => {
    if (shortMessage.length < 10) {
      alert("Please enter a more detailed message.");
      return;
    }
    setIsInviting(true);
    // Simulando envio para o Supabase ou backend
    setTimeout(() => {
      setIsInviting(false);
      alert("Application sent! Wait for the manager's response.");
      setShortMessage("");
    }, 2000);
  };

  return (
    <div style={styles.root}>
      <Head>
        <title>Apply to a Community | EZ Marketing</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 🟢 HEADER (topBar) - Padding 229px */}
      <header id="topBar" style={styles.topBar}>
        <div style={styles.topBarContent}>
          <div id="logoContainer" style={styles.logoContainer} onClick={() => router.push("/")}>
            <img 
              src="/plasmic/ez_marketing_platform/images/logo2Svg.svg" 
              style={styles.logoImg} 
              alt="Logo" 
            />
          </div>

          <nav style={styles.navMain}>
            <NavLink href="/a-service-dashboard" label="Service Dashboard" />
            <NavLink href="/a-community-dashboard" label="Community Dashboard" />
            <NavLink href="/market-trends" label="Market Trends" />
            <NavLink href="/a-find-a-business" label="Find a business" active />

            <div id="popover26" style={styles.profileArea}>
              <div style={styles.notificationBadge}>{notifications}</div>
              <div style={styles.avatarCircle} />
              <ChevronDownSvgIcon style={{ width: 12, color: "#535353" }} />
            </div>
          </nav>
        </div>
      </header>

      {/* 🔵 CONTEÚDO PRINCIPAL (Main Container) */}
      <main style={styles.mainContainer}>
        
        {/* SECTION HERO (container3 + container2) */}
        <section style={styles.heroSection}>
          
          {/* LADO ESQUERDO: Card da Comunidade */}
          <div id="container3" style={styles.communityCard}>
            <div style={styles.cardHeader}>
              <div id="communityLogo" style={styles.logoBox}>
                <SemTitulo1SvgIcon style={{ width: "100%", height: "100%" }} />
              </div>
              <div style={styles.titleArea}>
                <h1 style={styles.communityTitle}>Community Name</h1>
                <div style={styles.badgeRow}>
                  <div style={styles.tagGold}>GOLD</div>
                  <div style={styles.tagVerified}>
                    <CheckSvgIcon style={{ width: 10, marginRight: 4 }} />
                    Verified
                  </div>
                </div>
              </div>
            </div>

            {/* MÉTIDAS (communityRate + goalsSum) */}
            <div style={styles.metricsGrid}>
              <div id="communityRate" style={styles.metricBox}>
                <span style={styles.metricLabel}>Community Rate</span>
                <div id="rateSum" style={styles.metricValue}>U$ 0.00</div>
                <AntdRate disabled defaultValue={5} style={{ fontSize: 12 }} />
              </div>

              <div id="goalsSum" style={styles.metricBoxGlass}>
                <span style={styles.metricLabel}>Goals Reached</span>
                <div style={styles.metricValueLarge}>0/0</div>
                <div style={styles.progressTrack}>
                  <div style={{ ...styles.progressFill, width: "10%" }} />
                </div>
              </div>
            </div>

            {/* SLIDER DE MEMBROS */}
            <div id="sliderCarousel" style={styles.memberSliderArea}>
              <h4 style={styles.smallTitle}>Recent Active Members</h4>
              <Slider {...memberSettings}>
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} style={styles.slideItem}>
                    <div style={styles.memberAvatar} />
                    <div style={styles.memberName}>Member Name</div>
                    <div style={styles.memberRole}>Manager</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* LADO DIREITO: Card de Convite (container2) */}
          <div id="container2" style={styles.inviteCard}>
            <h2 style={styles.inviteTitle}>Join Community</h2>
            <p style={styles.inviteText}>
              If you are excited about working with this community, please enter a short message here and click "Invite"
            </p>

            <div style={styles.formGroup}>
              <label style={styles.fieldLabel}>Your Message</label>
              <AntdTextArea 
                id="shortMessage"
                value={shortMessage}
                onChange={(e: any) => setShortMessage(e.target.value)}
                placeholder="Ex: I would love to contribute with my marketing skills..."
                rows={6}
                style={styles.textArea}
              />
            </div>

            <AntdButton 
              id="inviteButon"
              type="primary"
              loading={isInviting}
              onClick={onInviteClick}
              style={styles.primaryButton}
            >
              INVITE
            </AntdButton>

            <Link href="/a-create-community" style={styles.footerLink}>
              Create a Community
            </Link>
          </div>
        </section>

        {/* SECTION PARCEIROS (container10) */}
        <section id="container10" style={styles.partnersSection}>
          <div style={styles.partnerDivider}>
            <div style={styles.line} />
            <span style={styles.lineText}>TRUSTED PARTNERS</span>
            <div style={styles.line} />
          </div>
          <div id="sliderCarousel2" style={styles.partnerSlider}>
            <Slider {...partnerSettings}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} style={styles.partnerLogo}>
                  <Icon38Icon style={{ width: 30, opacity: 0.5 }} />
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* SECTION EXPERTS (container11) */}
        <section id="container11" style={styles.expertsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Experts & Capabilities</h2>
            <div style={styles.searchBox}>
              <SearchSvgIcon style={{ width: 14, marginRight: 8 }} />
              <input type="text" placeholder="Filter skills..." style={styles.searchInput} />
            </div>
          </div>

          <div style={styles.tagsContainer}>
            <ExpertTag id="popover21" label="Service Scheduling" active />
            <ExpertTag id="popover22" label="Influencer Marketing" />
            <ExpertTag id="popover23" label="Commercial Production" active />
            <ExpertTag id="popover24" label="Performance Campaign" />
            <ExpertTag id="popover25" label="Digital Experiences" />
            <ExpertTag id="popover26" label="Branding Strategy" active />
            <ExpertTag id="popover27" label="Video Editing" />
          </div>
        </section>

        {/* SECTION TABS (About / Website) */}
        <section style={styles.detailsSection}>
          <div style={styles.tabHeader}>
            <button 
              style={activeTab === "about" ? styles.tabBtnActive : styles.tabBtn} 
              onClick={() => setActiveTab("about")}
            >About</button>
            <button 
              style={activeTab === "website" ? styles.tabBtnActive : styles.tabBtn} 
              onClick={() => setActiveTab("website")}
            >Website</button>
          </div>

          <div style={styles.tabBody}>
            {activeTab === "about" && (
              <div id="about" style={styles.tabContent}>
                <p>This community is focused on high-level marketing execution. Our members are vetted professionals who collaborate on large-scale digital projects.</p>
              </div>
            )}
            {activeTab === "website" && (
              <div id="website" style={styles.tabContent}>
                <a href="https://ezmarketing.space" target="_blank" style={styles.link}>
                  www.ezmarketing.space
                </a>
              </div>
            )}
          </div>
        </section>

        {/* SECTION VIDEO (youtubeVideo) */}
        <section id="youtubeVideo" style={styles.videoSection}>
          <div style={styles.videoFrame}>
            <YouTube 
              videoId="dQw4w9WgXcQ" 
              opts={{ width: "100%", height: "500px", playerVars: { autoplay: 0 } }} 
            />
          </div>
        </section>

      </main>

      {/* 🔴 FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <p>© 2024 EZ Marketing. All rights reserved.</p>
          <div style={styles.socialIcons}>
            <Icon13Icon style={{ width: 20 }} />
            <Icon36Icon style={{ width: 20 }} />
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- COMPONENTES INTERNOS (HELPERS) ---

function NavLink({ href, label, active = false }: { href: string, label: string, active?: boolean }) {
  return (
    <Link href={href} style={{
      ...styles.navItem,
      color: active ? "#000000" : "#535353",
      fontWeight: active ? 700 : 400,
      borderBottom: active ? "2px solid #74b924" : "2px solid transparent"
    }}>
      {label}
    </Link>
  );
}

function ExpertTag({ id, label, active = false }: { id: string, label: string, active?: boolean }) {
  return (
    <div id={id} style={{
      ...styles.tagBase,
      background: active ? "#74b924" : "#4a4a4a",
      boxShadow: active ? "0 4px 10px rgba(116, 185, 36, 0.4)" : "none"
    }}>
      {active && <CheckSvgIcon style={{ width: 12, marginRight: 8, color: "#fff" }} />}
      {label}
    </div>
  );
}

// --- OBJETO DE ESTILOS (MAPEADO DO CSS ORIGINAL) ---
const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "#e7e6e2",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "'Inter', sans-serif"
  },
  topBar: {
    height: "90px",
    background: "#ffffff",
    display: "flex",
    justifyContent: "center",
    borderBottom: "1px solid #d1d1d1",
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
  logoContainer: { cursor: "pointer" },
  logoImg: { height: "45px" },
  navMain: { display: "flex", alignItems: "center", gap: "25px" },
  navItem: { textDecoration: "none", fontSize: "14px", padding: "10px 0", transition: "0.3s" },
  profileArea: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", position: "relative" },
  notificationBadge: { position: "absolute", top: -5, left: 15, background: "#ff4d4f", color: "#fff", fontSize: "10px", padding: "2px 6px", borderRadius: "10px" },
  avatarCircle: { width: "35px", height: "35px", borderRadius: "50%", background: "#d9d9d9", border: "1px solid #ddd" },

  mainContainer: { width: "100%", maxWidth: "1440px", margin: "0 auto", padding: "40px 229px" },
  heroSection: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "30px", marginBottom: "50px" },
  
  communityCard: { background: "#ffffff", borderRadius: "30px", padding: "35px", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" },
  cardHeader: { display: "flex", gap: "20px", alignItems: "center", marginBottom: "30px" },
  logoBox: { width: "80px", height: "80px", background: "#f0f0f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center" },
  communityTitle: { fontSize: "24px", fontWeight: 800, margin: 0 },
  badgeRow: { display: "flex", gap: "8px", marginTop: "5px" },
  tagGold: { background: "linear-gradient(90deg, #d4af37, #f9e29c)", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: 700, color: "#5c4300" },
  tagVerified: { background: "#e6f7ff", color: "#1890ff", padding: "4px 10px", borderRadius: "6px", fontSize: "10px", display: "flex", alignItems: "center" },

  metricsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" },
  metricBox: { background: "#f9f9f9", padding: "20px", borderRadius: "20px", border: "1px solid #f0f0f0" },
  metricBoxGlass: { 
    background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
    padding: "20px", borderRadius: "20px", border: "4px solid #00000017", textAlign: "center" 
  },
  metricLabel: { fontSize: "12px", color: "#888", display: "block", marginBottom: "5px" },
  metricValue: { fontSize: "22px", fontWeight: 800, color: "#000" },
  metricValueLarge: { fontSize: "28px", fontWeight: 900, color: "#000" },
  progressTrack: { width: "100%", height: "6px", background: "#eee", borderRadius: "10px", marginTop: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#74b924" },

  memberSliderArea: { marginTop: "20px" },
  smallTitle: { fontSize: "14px", color: "#535353", marginBottom: "15px" },
  slideItem: { textAlign: "center", padding: "10px" },
  memberAvatar: { width: "55px", height: "55px", borderRadius: "50%", background: "#eee", margin: "0 auto 8px" },
  memberName: { fontSize: "12px", fontWeight: 600 },
  memberRole: { fontSize: "10px", color: "#999" },

  inviteCard: { background: "#ffffff", borderRadius: "30px", padding: "35px", display: "flex", flexDirection: "column" },
  inviteTitle: { fontSize: "22px", fontWeight: 700, marginBottom: "10px" },
  inviteText: { fontSize: "14px", color: "#535353", lineHeight: "1.6", marginBottom: "25px" },
  formGroup: { marginBottom: "20px" },
  fieldLabel: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" },
  textArea: { borderRadius: "15px", padding: "15px", border: "1px solid #d9d9d9", background: "#fcfcfc" },
  primaryButton: { height: "55px", borderRadius: "15px", background: "#74b924", border: "none", fontSize: "16px", fontWeight: 700, color: "#fff" },
  footerLink: { textAlign: "center", marginTop: "15px", fontSize: "12px", color: "#74b924", textDecoration: "none", fontWeight: 600 },

  partnersSection: { marginBottom: "50px" },
  partnerDivider: { display: "flex", alignItems: "center", gap: "15px", marginBottom: "25px" },
  line: { flex: 1, height: "1px", background: "#d1d1d1" },
  lineText: { fontSize: "11px", color: "#aaa", letterSpacing: "2px" },
  partnerSlider: { padding: "0 20px" },
  partnerLogo: { display: "flex", justifyContent: "center" },

  expertsSection: { marginBottom: "50px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  sectionTitle: { fontSize: "20px", fontWeight: 800 },
  searchBox: { display: "flex", alignItems: "center", background: "#fff", padding: "8px 15px", borderRadius: "10px", border: "1px solid #ddd" },
  searchInput: { border: "none", outline: "none", fontSize: "13px", width: "150px" },
  tagsContainer: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tagBase: { padding: "10px 20px", borderRadius: "30px", color: "#fff", fontSize: "13px", fontWeight: 500, display: "flex", alignItems: "center", transition: "0.2s" },

  detailsSection: { marginBottom: "50px" },
  tabHeader: { display: "flex", gap: "30px", borderBottom: "1px solid #d1d1d1", marginBottom: "20px" },
  tabBtn: { background: "none", border: "none", padding: "10px 0", fontSize: "15px", color: "#888", cursor: "pointer" },
  tabBtnActive: { background: "none", border: "none", padding: "10px 0", fontSize: "15px", color: "#000", fontWeight: 700, borderBottom: "3px solid #74b924", cursor: "pointer" },
  tabContent: { fontSize: "15px", color: "#535353", lineHeight: "1.8" },
  link: { color: "#74b924", textDecoration: "underline" },

  videoSection: { marginBottom: "60px", borderRadius: "30px", overflow: "hidden", boxShadow: "0 15px 40px rgba(0,0,0,0.1)" },
  videoFrame: { background: "#000" },

  footer: { background: "#fff", padding: "40px 0", borderTop: "1px solid #eee" },
  footerContent: { maxWidth: "1440px", margin: "0 auto", padding: "0 229px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  socialIcons: { display: "flex", gap: "20px", color: "#888" }
};
