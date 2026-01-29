// pages/c-edit-profile.tsx

import * as React from "react";
import { useRouter } from "next/router";

import { PageParamsProvider as PageParamsProvider__ } from "@plasmicapp/react-web/lib/host";
import GlobalContextsProvider from "../components/plasmic/ez_marketing_platform/PlasmicGlobalContextsProvider";
import { PlasmicCEditProfile } from "../components/plasmic/ez_marketing_platform/PlasmicCEditProfile";

import { getSupabaseC } from "../lib/c-supabaseClient";

function CEditProfile() {
  const router = useRouter();
  const supabase = getSupabaseC();

  /* ===========================
     STATE — espelha colunas
  ============================ */

  const [company_name, setCompanyName] = React.useState("");
  const [company_type, setCompanyType] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [foundation_date, setFoundationDate] = React.useState("");

  const [linkedin, setLinkedin] = React.useState("");
  const [instagram, setInstagram] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [x_link, setXLink] = React.useState("");

  const [tagline, setTagline] = React.useState("");
  const [area, setArea] = React.useState("");
  const [sub_area, setSubArea] = React.useState("");
  const [google_calendar, setGoogleCalendar] = React.useState("");

  const [solution, setSolution] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [step, setStep] = React.useState("");

  /* ===========================
     SAVE HANDLER
  ============================ */

  async function handleSave() {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("Usuário não autenticado");
      return;
    }

    const { error } = await supabase.from("companies").upsert({
      user_id: user.id,
      company_name,
      company_type,
      location,
      foundation_date,
      linkedin,
      instagram,
      website,
      x: x_link,
      tagline,
      area,
      sub_area,
      google_calendar,
      solution,
      description,
      price,
      step,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Erro ao salvar company:", error);
      return;
    }

    router.push("/dashboard");
  }

  /* ===========================
     RENDER
  ============================ */

  return (
    <GlobalContextsProvider>
      <PageParamsProvider__
        route={router.pathname}
        params={router.query}
        query={router.query}
      >
        <PlasmicCEditProfile
          overrides={{
            /* STEP 1 */
            company_name: {
              value: company_name,
              onChange: (e: any) => setCompanyName(e.target.value),
            },
            company_type: {
              value: company_type,
              onChange: (value: string) => setCompanyType(value),
            },
            location: {
              value: location,
              onChange: (e: any) => setLocation(e.target.value),
            },
            foundation_date: {
              value: foundation_date,
              onChange: (e: any) => setFoundationDate(e.target.value),
            },

            /* STEP 2 */
            linkedin: {
              value: linkedin,
              onChange: (e: any) => setLinkedin(e.target.value),
            },
            instagram: {
              value: instagram,
              onChange: (e: any) => setInstagram(e.target.value),
            },
            website: {
              value: website,
              onChange: (e: any) => setWebsite(e.target.value),
            },
            x: {
              value: x_link,
              onChange: (e: any) => setXLink(e.target.value),
            },

            /* STEP 3 */
            tagline: {
              value: tagline,
              onChange: (e: any) => setTagline(e.target.value),
            },
            area: {
              value: area,
              onChange: (value: string) => setArea(value),
            },
            sub_area: {
              value: sub_area,
              onChange: (value: string) => setSubArea(value),
            },
            google_calendar: {
              value: google_calendar,
              onChange: (e: any) =>
                setGoogleCalendar(e.target.value),
            },

            /* STEP 4 */
            solution: {
              value: solution,
              onChange: (e: any) => setSolution(e.target.value),
            },
            description: {
              value: description,
              onChange: (e: any) => setDescription(e.target.value),
            },
            price: {
              value: price,
              onChange: (e: any) => setPrice(e.target.value),
            },
            step: {
              value: step,
              onChange: (e: any) => setStep(e.target.value),
            },

            /* DONE */
            done_button: {
              onClick: handleSave,
            },
          }}
        />
      </PageParamsProvider__>
    </GlobalContextsProvider>
  );
}

export default CEditProfile;
