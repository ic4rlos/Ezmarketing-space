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
           CREATE ACCOUNT BUTTON
        ========================== */
        loginButton: {
          onClick: async (_e, formInstance) => {
            if (loading) return;

            setErrorMessage("");
            setLoading(true);

            try {
              const values = formInstance?.getFieldsValue?.() || {};

              const email = values.email;
              const password = values.password;
              const confirmPassword = values.confirmpassword;
              const acceptedTerms = values.checkbox2;

              // 🔹 Front-end validations
              if (!email || !password || !confirmPassword) {
                setErrorMessage("All fields are required.");
                return;
              }

              if (password !== confirmPassword) {
                setErrorMessage("Passwords do not match.");
                return;
              }

              if (!acceptedTerms) {
                setErrorMessage(
                  "You must accept the terms and conditions."
                );
                return;
              }

              // 🔹 Supabase signup
              const { error } = await supabase.auth.signUp({
                email,
                password,
              });

              if (error) {
                const msg = error.message.toLowerCase();

                if (msg.includes("password")) {
                  setErrorMessage(
                    "Password does not meet security requirements."
                  );
                } else if (msg.includes("email")) {
                  setErrorMessage(
                    "Invalid or already registered email."
                  );
                } else {
                  setErrorMessage(error.message);
                }
                return;
              }

              // ✅ Success
              router.push("/c-edit-profile");
            } finally {
              setLoading(false);
            }
          },
        },
      }}
    />
  );
}
