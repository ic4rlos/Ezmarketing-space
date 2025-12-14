import { useRouter } from "next/router";
import { useState } from "react";
import { PlasmicLCCreateAccount } from "@/components/plasmic/ez_marketing_platform/PlasmicLCCreateAccount";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreateAccountPage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <PlasmicLCCreateAccount
      overrides={{
        /* =========================
           ERROR TEXT
        ========================== */
        errorText: {
          children: errorMessage,
          style: {
            display: errorMessage ? "block" : "none",
            color: "red",
          },
        },

        /* =========================
           SUBMIT BUTTON
        ========================== */
        loginButton: {
          props: {
            onClick: async (_, formInstance) => {
              if (loading) return;

              setErrorMessage("");
              setLoading(true);

              try {
                // 🔹 LENDO DIRETO DO FORM (FONTE ÚNICA DE VERDADE)
                const values = formInstance?.getFieldsValue?.() || {};

                const email = values.email;
                const password = values.password;
                const confirmPassword = values.confirmpassword;
                const acceptedTerms = values.checkbox2;

                // 🔸 VALIDAÇÕES FRONT-END
                if (!email || !password || !confirmPassword) {
                  setErrorMessage("All fields are required.");
                  return;
                }

                if (password !== confirmPassword) {
                  setErrorMessage("Passwords do not match.");
                  return;
                }

                if (!acceptedTerms) {
                  setErrorMessage("You must accept the terms and conditions.");
                  return;
                }

                // 🔹 SUPABASE SIGN UP
                const { error } = await supabase.auth.signUp({
                  email,
                  password,
                });

                if (error) {
                  // 🔸 ERROS CONHECIDOS DO SUPABASE
                  if (error.message.toLowerCase().includes("password")) {
                    setErrorMessage(
                      "Password does not meet security requirements."
                    );
                  } else if (
                    error.message.toLowerCase().includes("email")
                  ) {
                    setErrorMessage("Invalid or already registered email.");
                  } else {
                    setErrorMessage(error.message);
                  }
                  return;
                }

                // ✅ SUCESSO
                router.push("/c-edit-profile");
              } finally {
                setLoading(false);
              }
            },
          },
        },
      }}
    />
  );
}
