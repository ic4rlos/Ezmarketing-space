import React from "react";
import styles from "../components/plasmic/ez_marketing_platform/PlasmicLCLogin.module.css";
import Link from "next/link";
import { PlasmicLink } from "@plasmicapp/react-web"; // 🔥 Ativamos o PlasmicLink (moderado)

export default function CLogin() {
  return (
    <div className={styles.root}>
      {/* Logo */}
      <img
        src="/plasmic/ez_marketing_platform/images/logo2Svg.svg"
        className={styles.img}
        alt="Ez Marketing Logo"
      />

      {/* Retângulo branco */}
      <div className={styles.rectangle}>
        {/* Título */}
        <div className={styles.text__o0KFf}>
          <h6 className={styles.h6}>Login</h6>
        </div>

        {/* Formulário */}
        <form className={styles.form}>
          {/* Campo Email */}
          <div className={styles.formField__nVf3S}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/user.svg"
                alt=""
                className={styles.svg__wXpbV}
              />
              <input
                type="email"
                placeholder="Email"
                className={styles.email}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className={styles.formField__p0HYe}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src="/plasmic/ez_marketing_platform/icons/lock.svg"
                alt=""
                className={styles.svg__ihNhg}
              />
              <input
                type="password"
                placeholder="Password"
                className={styles.password}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                }}
              />
            </div>
          </div>

          {/* Botão login */}
          <button
            type="submit"
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
          >
            Login
          </button>

          {/* Forgot Password */}
          <PlasmicLink
            component={Link}
            href="/c-reset-password"
            className={styles.link__o7Usc}
          >
            Forgot password?
          </PlasmicLink>

          {/* Sign in with Google */}
          <button
            type="button"
            className={styles.signInWithGoogle}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              width: "248px",
              height: "37px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              background: "white",
              marginTop: "10px",
            }}
          >
            <img
              src="/plasmic/ez_marketing_platform/icons/google.svg"
              alt=""
              width="18"
            />
            Sign in with Google
          </button>
        </form>

        {/* Create account */}
        <div className={styles.createAccount}>
          <div className={styles.text__aXkee}>New to Ez Marketing?</div>

          {/* Aqui também versão Plasmic do link */}
          <PlasmicLink
            component={Link}
            href="/c-create-account"
            className={styles.link__dNNeM}
          >
            Create account
          </PlasmicLink>
        </div>
      </div>
    </div>
  );
}
