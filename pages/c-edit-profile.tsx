import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSupabaseC } from "../lib/c-supabaseClient";
import { GlobalContextsProvider } from "../components/plasmic/ez_marketing_platform/GlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

export default function CEditProfileSentinel() {
  const router = useRouter();

  useEffect(() => {
    console.log("🔥 SENTINELA v4.3 ATIVA");

    const supabase = getSupabaseC();

    // 🔍 força localizar o botão Done do Plasmic
    const interval = setInterval(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const doneButton = buttons.find(
        (btn) => btn.textContent?.trim().toLowerCase() === "done"
      );

      if (!doneButton) return;

      clearInterval(interval);
      console.log("🧨 BOTÃO DONE DO PLASMIC INTERCEPTADO");

      doneButton.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();

        alert("🧪 SENTINELA: clique interceptado");

        // 🧲 leitura crua dos inputs do DOM
        const textareas = Array.from(
          document.querySelectorAll("textarea")
        ).map((t) => t.value);

        const payload = {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          customer_problem: textareas[0] || null,
          solution_description: textareas[1] || null,
          why_choose: textareas[2] || null,
        };

        console.log("📦 PAYLOAD ENVIADO:", payload);
        alert("📦 Payload montado, enviando ao Supabase");

        const { error } = await supabase.from("companies").insert(payload);

        if (error) {
          console.error("❌ ERRO SUPABASE:", error);
          alert("❌ Supabase recusou o payload (ver console)");
          return;
        }

        alert("✅ SUPABASE CONFIRMOU INSERT\nRedirecionando...");
        router.push("/find-a-affiliate/");
      });
    }, 500);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <GlobalContextsProvider>
      <PlasmicCEditProfile />
    </GlobalContextsProvider>
  );
}
