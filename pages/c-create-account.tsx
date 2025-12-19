import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Checkbox } from "antd";

import { getSupabaseC } from "../lib/c-supabaseClient";

import AntdInput from "../components/ui/AntdInput";
import LoginButton from "../components/LoginButton";

import styles from "../components/plasmic/projectcss.module.css";

export default function CreateAccountPage() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateAccount() {
    setError(null);

    if (!acceptedTerms) {
      setError("Você precisa aceitar os termos para continuar.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/c-login");
  }

  return (
    <>
      <Head>
        <title>Criar conta</title>
      </Head>

      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 800,
            padding: 32,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ fontSize: 26, marginBottom: 24 }}>
            Criar conta
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <AntdInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AntdInput
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* CHECKBOX — ANT DESIGN (CORRETO) */}
            <Checkbox
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
            >
              <span style={{ fontSize: 10 }}>
                Eu aceito os termos de uso e política de privacidade
              </span>
            </Checkbox>

            {error && (
              <div className={styles.errorText}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "center" }}>
              <LoginButton
                loading={loading}
                onClick={handleCreateAccount}
              >
                Criar conta
              </LoginButton>
            </div>

            <div style={{ textAlign: "center", fontSize: 12 }}>
              Já tem conta?{" "}
              <Link href="/c-login">Entrar</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
