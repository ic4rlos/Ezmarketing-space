import * as React from "react";
import { useRouter } from "next/router";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicImg } from "@plasmicapp/react-web";

import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCreateAccount } from "../components/plasmic/ez_marketing_platform/PlasmicCreateAccount";
import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CreateAccountPage() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function handleCreateAccount() {
    if (loading) return;
    setError(null);

    if (!email || !password) {
      setError("Email e senha obrigatórios");
      return;
    }

    if (password !== confirmPassword) {
      setError("Senhas não conferem");
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

    router.push("/c-edit-profile");
  }

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        {/* PLASMIC COM CONTROLE VISUAL TOTAL */}
        <PlasmicCreateAccount
          // inputs “cegos” controlados pelo Plasmic
          emailValue={email}
          passwordValue={password}
          confirmPasswordValue={confirmPassword}

          // eventos perigosíssimos (delegados)
          onEmailChange={(e: any) => setEmail(e.target.value)}
          onPasswordChange={(e: any) => setPassword(e.target.value)}
          onConfirmPasswordChange={(e: any) =>
            setConfirmPassword(e.target.value)
          }

          // ação principal
          onSubmit={handleCreateAccount}

          // estado visual
          loading={loading}
          errorMessage={error}

          // assets 100% Plasmic
          logo={
            <PlasmicImg
              src={{
                src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg",
                fullWidth: 297,
                fullHeight: 210,
              }}
              alt="Logo"
            />
          }
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}
