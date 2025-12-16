import React from "react";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount.module.css";
import Link from "next/link";
import { PlasmicLink } from "@plasmicapp/react-web";

export default function CCreateAccount() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  return (
    <div className={styles.root}>
      {/* Logo */}
      <img
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        className={styles.img}
        alt="Ez Marketing Logo"
      />

      {/* Caixa branca */}
      <div className={styles.rectangle}>
        {/* Título */}
        <div className={styles.text__oCjRw}>
          <h6 className={styles.h6}>Create account</h6>
        </div>

        {/* FORM MANUAL — SEM ANT, SEM PLASMIC */}
        <form className={styles.form2}>
          {/* EMAIL */}
          <div className={styles.formField__bwLhI}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/user.svg"
                className={styles.svg__f2O7}
                alt=""
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  console.log("EMAIL:", e.target.value);
                  setEmail(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className={styles.formField___4XlWd}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/lock.svg"
                className={styles.svg__elYWb}
                alt=""
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  console.log("PASSWORD:", e.target.value);
                  setPassword(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formField___0Hc3Z}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/lock.svg"
                className={styles.svg__hmebx}
                alt=""
              />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => {
                  console.log("CONFIRM:", e.target.value);
                  setConfirmPassword(e.target.value);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />
            </div>
          </div>

          {/* BOTÃO FEIO */}
          <button
            type="button"
            className={styles.loginButton}
            style={{
              background: "#31c42f",
              border: "none",
              borderRadius: "8px",
              color: "white",
              width: "248px",
              height: "37px",
              cursor: "pointer",
              marginTop: "15px",
            }}
            onClick={() => {
              console.log("SUBMIT", { email, password, confirmPassword });
            }}
          >
            Create account
          </button>
        </form>

        {/* LINK LOGIN */}
        <div className={styles.createAccount}>
          <div className={styles.text__j3Au8}>Already have an account?</div>
          <PlasmicLink
            component={Link}
            href="/c-login"
            className={styles.link__z76Ps}
          >
            Login
          </PlasmicLink>
        </div>
      </div>
    </div>
  );
}
