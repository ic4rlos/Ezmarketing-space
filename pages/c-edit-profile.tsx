import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  PlasmicRootProvider,
  PlasmicComponent,
} from "@plasmicapp/react-web";

import { getSupabaseC } from "../lib/c-supabaseClient";

export default function CEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseC();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);

  /* ===============================
     🔹 ESTADO = NÓS (COLUNAS)
     =============================== */

  const [company_name, setCompanyName] = useState("");
  const [company_type, setCompanyType] = useState("");
  const [location, setLocation] = useState("");
  const [foundation_date, setFoundationDate] = useState("");
  const [company_tagline, setCompanyTagline] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [x, setX] = useState("");

  /* ===============================
     🔐 AUTH + LOAD COMPANY
     =============================== */

  useEffect(() => {
    async function bootstrap() {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace("/c-login");
        return;
      }

      if (data.user.user_metadata?.type !== "company") {
        router.replace("/not-authorized");
        return;
      }

      setUser(data.user);

      // buscar company do usuário
      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_user_id", data.user.id)
        .single();

      if (company) {
        setCompanyId(company.id);
        setCompanyName(company.company_name || "");
        setCompanyType(company.company_type || "");
        setLocation(company.location || "");
        setFoundationDate(company.foundation_date || "");
        setCompanyTagline(company.company_tagline || "");
        setWebsite(company.website || "");
        setLinkedin(company.linkedin || "");
        setInstagram(company.instagram || "");
        setX(company.x || "");
      }

      setLoading(false);
    }

    bootstrap();
  }, []);

  /* ===============================
     💾 SAVE (BOTÃO DONE)
     =============================== */

  async function handleSave() {
    if (!user) return;

    const payload = {
      owner_user_id: user.id,
      company_name,
      company_type,
      location,
      foundation_date,
      company_tagline,
      website,
      linkedin,
      instagram,
      x,
    };

    const { error } = await supabase
      .from("companies")
      .upsert(payload, {
        onConflict: "owner_user_id",
      });

    if (error) {
      console.error("Erro ao salvar company:", error);
      alert("Erro ao salvar dados");
      return;
    }

    alert("Perfil salvo com sucesso 🚀");
  }

  if (loading) return null;

  /* ===============================
     🎨 PLASMIC (SÓ UI)
     =============================== */

  return (
    <PlasmicRootProvider
      user={{
        id: user.id,
        email: user.email,
        type: "company",
      }}
    >
      <PlasmicComponent
        component="C - Edit profile"
        overrides={{
          company_name: {
            value: company_name,
            onChange: (e: any) => setCompanyName(e.target.value),
          },
          company_type: {
            value: company_type,
            onChange: (e: any) => setCompanyType(e),
          },
          location: {
            value: location,
            onChange: (e: any) => setLocation(e.target.value),
          },
          foundation_date: {
            value: foundation_date,
            onChange: (e: any) => setFoundationDate(e.target.value),
          },
          company_tagline: {
            value: company_tagline,
            onChange: (e: any) => setCompanyTagline(e.target.value),
          },
          website: {
            value: website,
            onChange: (e: any) => setWebsite(e.target.value),
          },
          linkedin: {
            value: linkedin,
            onChange: (e: any) => setLinkedin(e.target.value),
          },
          instagram: {
            value: instagram,
            onChange: (e: any) => setInstagram(e.target.value),
          },
          x: {
            value: x,
            onChange: (e: any) => setX(e.target.value),
          },
          done_button: {
            onClick: handleSave,
          },
        }}
      />
    </PlasmicRootProvider>
  );
}
