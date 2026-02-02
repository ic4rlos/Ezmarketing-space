import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// --- IMPORTAÇÕES SEGURAS (Ícones básicos que confirmamos existir ou SVGs locais) ---
// Se esses ícones ainda falharem, o código abaixo usa fallbacks internos.
import SemTitulo1SvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__SemTitulo1Svg";
import CheckSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__CheckSvg";
import ChevronDownSvgIcon from "../components/plasmic/ez_marketing_platform/icons/PlasmicIcon__ChevronDownSvg";

// --- COMPONENTES DINÂMICOS (SSR: FALSE para evitar conflitos de versão React/Slick) ---
const Slider = dynamic<any>(() => import("react-slick").then(m => m.default), { ssr: false });
const YouTube = dynamic<any>(() => import("react-youtube").then(m => m.default), { ssr: false });
const AntdButton = dynamic<any>(() => import("antd").then(m => m.Button), { ssr: false });
const AntdTextArea = dynamic<any>(() => import("antd").then(m => m.Input).then(i => i.TextArea), { ssr: false });
const AntdRate = dynamic<any>(() => import("antd").then(m => m.Rate), { ssr: false });
const AntdAvatar = dynamic<any>(() => import("antd").then(m => m.Avatar), { ssr: false });
const AntdTooltip = dynamic<any>(() => import("antd").then(m => m.Tooltip), { ssr: false });

// --- ÍCONES FALLBACK (SVG PURO) Para garantir que o Build nunca quebre por falta de arquivo ---
const SearchIcon = () => (
  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 16 }}>
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);

const BusinessIcon = () => (
  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 24 }}>
    <path d="M3 21h18M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7M4 21V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v17"/>
  </svg>
);

/**
 * PÁGINA: AApplyToACommunity
 * Versão 4.0 - Build Resiliente & Código Completo
 */
export default function AApplyToACommunity() {
  const router = useRouter();

  // --- ESTADOS ---
  const [shortMessage, setShortMessage] = React.useState("");
  const [isInviting, setIsInviting] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("about");
  const [count, setCount] = React.useState(0);

  // --- CONFIGURAÇÕES DE UI ---
  const memberSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  const partnerSettings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    speed: 5000,
    slidesToShow: 5,
    infinite: true
  };

  // --- MÉTODOS ---
  const handleInvite = async () => {
    if (shortMessage.trim().length < 5) return alert("Please write a valid message.");
    setIsInviting(true);
    // Simulação de Supabase call
    await new Promise(r => setTimeout(r, 1500));
    setIsInviting(false);
    alert("Application sent successfully!");
    setShortMessage("");
  };

  return (
    <div style={styles.root}>
      <Head>
        <title>Apply to a Community | EZ Marketing Space</title>
        <meta name="description" content="Join the most exclusive marketing communities" />
      </Head>

      {/* 🟢 NAVBAR (Design Fiel com Padding 229px) */}
      <header style={styles.topBar}>
        <div style={styles.topBarContent}>
          <div style={styles.logoGroup} onClick={() => router.push("/")}>
            <div style={styles.logoPlaceholder}>EZ</div>
            <span style={styles.logoText}>MARKETING</span>
          </div>

          <nav style={styles.navMenu}>
            <NavLink href="/service-dashboard" label="Service Dashboard" />
            <NavLink href="/community-dashboard" label="Community Dashboard" />
            <NavLink href="/market-trends" label="Market Trends" />
            <NavLink href="/find-a-business" label="Find a business" active />
            
            <div style={styles.userSection}>
              <div style={styles.avatarMini} />
              <ChevronDownSvgIcon style={{ width: 12, marginLeft: 5 }} />
            </div>
          </nav>
        </div>
      </header>

      {/* 🔵 CONTEÚDO PRINCIPAL */}
      <main style={styles.main}>
        
        {/* GRID HERO: Info Community + Invite Form */}
        <section style={styles.heroGrid}>
          
          {/* CARD ESQUERDO: Perfil da Comunidade */}
          <div id="container3" style={styles.communityProfile}>
            <div style={styles.headerProfile}>
              <div id="communityLogo" style={styles.mainLogoWrapper}>
                <SemTitulo1SvgIcon style={{ width: "60%", height: "60%" }} />
              </div>
              <div style={styles.titleWrapper}>
                <h1 style={styles.h1}>Creative Strategy Hub</h1>
                <div style={styles.badgeRow}>
                  <div style={styles.goldBadge}>GOLD MEMBER</div>
                  <div style={styles.verifiedBadge}>
                    <CheckSvgIcon style={{ width: 10, marginRight: 4 }} /> Verified
                  </div>
                </div>
              </div>
            </div>

            {/* Dash de Performance */}
            <div style={styles.metricsRow}>
              <div id="communityRate" style={styles.metricCard}>
                <span style={styles.mLabel}>Current Rate</span>
                <div id="rateSum" style={styles.mValue}>U$ 18,250.00</div>
                <AntdRate disabled defaultValue={4} style={{ fontSize: 12 }} />
              </div>

              <div id="goalsSum" style={styles.metricCardSpecial}>
                <span style={styles.mLabel}>Project Goals</span>
                <div style={styles.mValueLarge}>85%</div>
                <div style={styles.progressBg}>
                  <div style={{ ...styles.progressFill, width: '85%' }} />
                </div>
              </div>
            </div>

            {/* Membros Ativos */}
            <div id="sliderCarousel" style={styles.membersArea}>
              <h3 style={styles.h3}>Top Contributors</h3>
              <Slider {...memberSettings}>
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} style={styles.memberSlide}>
                    <div style={styles.memberCircle} />
                    <div style={styles.mName}>Expert {i}</div>
                    <div style={styles.mRole}>Lead Designer</div>
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          {/* CARD DIREITO: Formulário de Inscrição */}
          <div id="container2" style={styles.inviteBox}>
            <h2 style={styles.h2}>Apply to Join</h2>
            <p style={styles.p}>
              Briefly describe how your expertise can help this community achieve its current goals.
            </p>

            <div style={styles.field}>
              <label style={styles.label}>Your Message</label>
              <AntdTextArea 
                id="shortMessage"
                value={shortMessage}
                onChange={(e: any) => setShortMessage(e.target.value)}
                placeholder="I have 5 years of experience in..."
                rows={8}
                style={styles.customInput}
              />
            </div>

            <AntdButton 
              id="inviteButon"
              type="primary"
              loading={isInviting}
              onClick={handleInvite}
              style={styles.btnPrimary}
            >
              SEND APPLICATION
            </AntdButton>

            <div style={styles.inviteFooter}>
              <span>New here?</span>
              <Link href="/create" style={styles.greenLink}>Start your own community</Link>
            </div>
          </div>
        </section>

        {/* SECTION: Parceiros (Infinite Slider) */}
        <section style={styles.partnersSection}>
          <div style={styles.divider}>
            <div style={styles.line} />
            <span style={styles.lineText}>ENTERPRISE PARTNERS</span>
            <div style={styles.line} />
          </div>
          <Slider {...partnerSettings}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} style={styles.partnerLogo}>
                <BusinessIcon />
                <span style={{ fontSize: 10, marginLeft: 8 }}>PARTNER_{i}</span>
              </div>
            ))}
          </Slider>
        </section>

        {/* SECTION: Tags e Especialidades */}
        <section id="container11" style={styles.tagsSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>Community Capabilities</h2>
            <div style={styles.searchWrap}>
              <SearchIcon />
              <input type="text" placeholder="Search skills..." style={styles.minimalSearch} />
            </div>
          </div>
          <div style={styles.tagCloud}>
            <ExpertTag id="popover21" text="Growth Hacking" active />
            <ExpertTag id="popover22" text="UI/UX Design" />
            <ExpertTag id="popover23" text="Copywriting" active />
            <ExpertTag id="popover24" text="Media Buying" />
            <ExpertTag id="popover25" text="Video Production" active />
            <ExpertTag id="popover26" text="Data Science" />
            <ExpertTag id="popover27" text="Public Relations" />
            <ExpertTag id="popover28" text="Brand Identity" active />
          </div>
        </section>

        {/* SECTION: Abas de Informação */}
        <section style={styles.tabsArea}>
          <div style={styles.tabsHeader}>
            <button onClick={() => setActiveTab("about")} style={activeTab === "about" ? styles.tabActive : styles.tabInactive}>Description</button>
            <button onClick={() => setActiveTab("website")} style={activeTab === "website" ? styles.tabActive : styles.tabInactive}>External Links</button>
          </div>
          <div style={styles.tabsContent}>
            {activeTab === "about" ? (
              <p id="about">We are a collective of freelancers and agencies working together to bridge the gap between creative vision and technical execution. Our community manages over $2M in ad spend monthly.</p>
            ) : (
              <a id="website" href="#" style={styles.greenLink}>https://community-hub.ezmarketing.space</a>
            )}
          </div>
        </section>

        {/* SECTION: Video Showcase */}
        <section id="youtubeVideo" style={styles.videoWrap}>
           <YouTube 
              videoId="dQw4w9WgXcQ" 
              opts={{ width: '100%', height: '540px', playerVars: { autoplay: 0 }}} 
           />
        </section>

      </main>

      {/* 🔴 FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <p>© 2024 EZ Marketing Platform. All rights reserved.</p>
          <div style={styles.socials}>
             <div style={styles.dot} />
             <div style={styles.dot} />
             <div style={styles.dot} />
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- SUBCOMPONENTES ---

function NavLink({ href, label, active = false }: any) {
  return (
    <Link href={href} style={{
      ...styles.navLink,
      color: active ? "#000" : "#666",
      fontWeight: active ? 700 : 400,
      borderBottom: active ? "2px solid #74b924" : "2px solid transparent"
    }}>
      {label}
    </Link>
  );
}

function ExpertTag({ id, text, active = false }: any) {
  return (
    <div id={id} style={{
      ...styles.tag,
      background: active ? "#74b924" : "#4a4a4a",
      color: "#fff"
    }}>
      {active && <CheckSvgIcon style={{ width: 12, marginRight: 8 }} />}
      {text}
    </div>
  );
}

// --- ESTILIZAÇÃO (Mapeada do CSS Original) ---
const styles: Record<string, React.CSSProperties> = {
  root: { background: "#e7e6e2", minHeight: "100vh", fontFamily: "'Inter', sans-serif" },
  topBar: { height: "90px", background: "#fff", display: "flex", justifyContent: "center", borderBottom: "1px solid #ddd", position: "sticky", top: 0, zIndex: 999 },
  topBarContent: { width: "100%", maxWidth: "1440px", padding: "0 229px", display: "flex", alignItems: "center", justifyContent: "space-between" },
  logoGroup: { cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
  logoPlaceholder: { background: "#000", color: "#fff", padding: "5px 8px", fontWeight: 900, borderRadius: "4px" },
  logoText: { fontWeight: 800, fontSize: "18px", letterSpacing: "-1px" },
  navMenu: { display: "flex", gap: "25px", alignItems: "center" },
  navLink: { textDecoration: "none", fontSize: "14px", padding: "8px 0" },
  avatarMini: { width: "35px", height: "35px", borderRadius: "50%", background: "#ccc" },
  userSection: { display: "flex", alignItems: "center", cursor: "pointer" },

  main: { maxWidth: "1440px", margin: "0 auto", padding: "40px 229px" },
  heroGrid: { display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "30px", marginBottom: "40px" },
  
  communityProfile: { background: "#fff", borderRadius: "32px", padding: "40px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" },
  headerProfile: { display: "flex", gap: "25px", alignItems: "center", marginBottom: "35px" },
  mainLogoWrapper: { width: "100px", height: "100px", background: "#f8f9fa", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #eee" },
  titleWrapper: { display: "flex", flexDirection: "column" },
  h1: { fontSize: "28px", fontWeight: 900, margin: 0 },
  badgeRow: { display: "flex", gap: "10px", marginTop: "8px" },
  goldBadge: { background: "linear-gradient(135deg, #d4af37, #f9e29c)", color: "#5c4300", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 700 },
  verifiedBadge: { background: "#e1f5fe", color: "#0288d1", padding: "4px 12px", borderRadius: "6px", fontSize: "11px", display: "flex", alignItems: "center" },

  metricsRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "35px" },
  metricCard: { background: "#fdfdfd", padding: "20px", borderRadius: "20px", border: "1px solid #f0f0f0" },
  metricCardSpecial: { 
    background: "radial-gradient(ellipse 40% 60% at 20% 20%, #ce9fff00 0%, #ffffff 100%)",
    padding: "20px", borderRadius: "20px", border: "4px solid #00000017", textAlign: "center" 
  },
  mLabel: { fontSize: "12px", color: "#999", display: "block", marginBottom: "5px" },
  mValue: { fontSize: "22px", fontWeight: 800 },
  mValueLarge: { fontSize: "28px", fontWeight: 900 },
  progressBg: { width: "100%", height: "8px", background: "#eee", borderRadius: "10px", marginTop: "12px", overflow: "hidden" },
  progressFill: { height: "100%", background: "#74b924" },

  membersArea: { marginTop: "20px" },
  h3: { fontSize: "16px", fontWeight: 700, marginBottom: "20px" },
  memberSlide: { textAlign: "center", outline: "none" },
  memberCircle: { width: "65px", height: "65px", borderRadius: "50%", background: "#eee", margin: "0 auto 10px", border: "3px solid #fff", boxShadow: "0 5px 15px rgba(0,0,0,0.05)" },
  mName: { fontSize: "13px", fontWeight: 600 },
  mRole: { fontSize: "11px", color: "#aaa" },

  inviteBox: { background: "#fff", borderRadius: "32px", padding: "40px", height: "fit-content" },
  h2: { fontSize: "24px", fontWeight: 800, margin: "0 0 10px" },
  p: { fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "30px" },
  field: { marginBottom: "25px" },
  label: { fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "8px" },
  customInput: { borderRadius: "16px", padding: "15px", border: "1px solid #ddd", background: "#fafafa" },
  btnPrimary: { height: "55px", width: "100%", borderRadius: "16px", background: "#74b924", border: "none", fontSize: "16px", fontWeight: 700 },
  inviteFooter: { textAlign: "center", marginTop: "20px", fontSize: "13px", color: "#999" },
  greenLink: { color: "#74b924", fontWeight: 700, textDecoration: "none", marginLeft: "5px" },

  partnersSection: { marginBottom: "60px" },
  divider: { display: "flex", alignItems: "center", gap: "20px", marginBottom: "30px" },
  line: { flex: 1, height: "1px", background: "#ccc" },
  lineText: { fontSize: "11px", color: "#aaa", letterSpacing: "2px" },
  partnerLogo: { display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 },

  tagsSection: { marginBottom: "50px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "25px" },
  searchWrap: { display: "flex", alignItems: "center", gap: "8px", background: "#fff", padding: "8px 15px", borderRadius: "12px", border: "1px solid #ddd" },
  minimalSearch: { border: "none", outline: "none", fontSize: "13px" },
  tagCloud: { display: "flex", flexWrap: "wrap", gap: "10px" },
  tag: { padding: "10px 22px", borderRadius: "40px", fontSize: "13px", fontWeight: 600, display: "flex", alignItems: "center", transition: "0.2s" },

  tabsArea: { marginBottom: "50px" },
  tabsHeader: { display: "flex", gap: "35px", borderBottom: "1px solid #ddd", marginBottom: "25px" },
  tabActive: { background: "none", border: "none", padding: "15px 0", fontSize: "16px", fontWeight: 800, color: "#000", borderBottom: "3px solid #74b924", cursor: "pointer" },
  tabInactive: { background: "none", border: "none", padding: "15px 0", fontSize: "16px", color: "#999", cursor: "pointer" },
  tabsContent: { fontSize: "15px", color: "#555", lineHeight: "1.8" },

  videoWrap: { width: "100%", borderRadius: "40px", overflow: "hidden", boxShadow: "0 25px 50px rgba(0,0,0,0.15)", background: "#000" },

  footer: { borderTop: "1px solid #ddd", padding: "50px 0", marginTop: "50px", background: "#fff" },
  footerInner: { maxWidth: "1440px", margin: "0 auto", padding: "0 229px", display: "flex", justifyContent: "space-between", color: "#999", fontSize: "12px" },
  socials: { display: "flex", gap: "10px" },
  dot: { width: "8px", height: "8px", background: "#ddd", borderRadius: "50%" }
};
