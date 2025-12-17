import * as React from "react";
import { useRouter } from "next/router";
import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import { PlasmicLink, PlasmicImg, PlasmicComponent, PlasmicRoot } from "@plasmicapp/react-web";
import { getSupabaseC } from "../lib/c-supabaseClient";

// Plasmic vai controlar o DOM completo
const PlasmicCreateAccount = () => {
  const router = useRouter();
  const supabase = getSupabaseC();
  
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  // Função de login (completamente lógica injetada)
  const handleCreateAccount = async () => {
    if (loading) return;

    setError(null);

    if (!email || !password) {
      setError("Email and password required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
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
  };

  return (
    <PageParamsProvider__ route={router.pathname} params={router.query} query={router.query}>
      {/* O Plasmic vai controlar o DOM aqui, o que é uma escolha desastrada */}
      <PlasmicRoot>
        <div className="root">
          <PlasmicImg 
            className="logo" 
            src={{src: "/plasmic/ez_marketing_platform/images/logo2Svg.svg", fullWidth: 297, fullHeight: 210}} 
            alt="Logo"
          />

          {/* Slots livres e children arbitrários */}
          <div className="container">
            <div className="form-card">
              <h3>Create Account</h3>
              
              {/* Inputs com eventos e slots livres, perigoso */}
              <PlasmicComponent
                component="PlasmicInput"
                props={{
                  value: email,
                  onChange: (e: any) => setEmail(e.target.value),
                }}
              />
              
              <PlasmicComponent
                component="PlasmicInput"
                props={{
                  value: password,
                  onChange: (e: any) => setPassword(e.target.value),
                }}
              />
              
              <PlasmicComponent
                component="PlasmicInput"
                props={{
                  value: confirmPassword,
                  onChange: (e: any) => setConfirmPassword(e.target.value),
                }}
              />

              {/* Componente externo: react-slick (perigoso e obsoleto) */}
              <PlasmicComponent
                component="PlasmicReactSlick"
                props={{
                  options: {
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                }}
              />

              {/* Botão com evento maluco injetado no Plasmic */}
              <button
                className="create-btn"
                onClick={handleCreateAccount}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </button>

              {/* Link com outro componente Plasmic*/}
              <PlasmicLink component="a" href="/c-login">
                Already have an account? Login here.
              </PlasmicLink>
            </div>
          </div>
        </div>
      </PlasmicRoot>
    </PageParamsProvider__>
  );
};

export default PlasmicCreateAccount;
