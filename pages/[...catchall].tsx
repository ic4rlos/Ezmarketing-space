import { GetServerSideProps } from "next";
import {
  PlasmicRootProvider,
  PlasmicComponent,
} from "@plasmicapp/loader-nextjs";
import { PLASMIC } from "../plasmic-init";
import { createClient } from "@supabase/supabase-js";

type PageProps = {
  plasmicData: any;
  component: string;
  userCompany: any;
  userAgency: any;
  companyData: any;
  agencyData: any;
};

export default function CatchAllPage(props: PageProps) {
  const {
    plasmicData,
    component,
    userCompany,
    userAgency,
    companyData,
    agencyData,
  } = props;

  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <PlasmicComponent
        component={component}
        componentProps={{
          userCompany,
          userAgency,
          companyData,
          agencyData,
        }}
      />
    </PlasmicRootProvider>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ===============================
  // 1️⃣ Resolver rota do Plasmic
  // ===============================
  const plasmicPath = context.params?.catchall ?? [];
  const plasmicData = await PLASMIC.fetchComponentData(plasmicPath);

  if (!plasmicData || !plasmicData.entryCompMetas.length) {
    return { notFound: true };
  }

  const component = plasmicData.entryCompMetas[0].displayName;

  // ===============================
  // 2️⃣ Extrair tokens corretos
  // ===============================
  const companyToken =
    context.req.cookies["sb-company-auth-token"] ?? null;

  const agencyToken =
    context.req.cookies["sb-agency-auth-token"] ?? null;

  // ===============================
  // 3️⃣ Criar clients separados
  // ===============================
  const companyClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_COMPANY_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_COMPANY_ANON_KEY!,
    {
      global: {
        headers: companyToken
          ? { Authorization: `Bearer ${companyToken}` }
          : {},
      },
    }
  );

  const agencyClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_AGENCY_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_AGENCY_ANON_KEY!,
    {
      global: {
        headers: agencyToken
          ? { Authorization: `Bearer ${agencyToken}` }
          : {},
      },
    }
  );

  // ===============================
  // 4️⃣ Buscar usuários
  // ===============================
  const {
    data: { user: userCompany },
  } = companyToken
    ? await companyClient.auth.getUser()
    : { data: { user: null } };

  const {
    data: { user: userAgency },
  } = agencyToken
    ? await agencyClient.auth.getUser()
    : { data: { user: null } };

  // ===============================
  // 5️⃣ Buscar dados com RLS
  // ===============================
  let companyData = null;
  let agencyData = null;

  if (userCompany) {
    const { data } = await companyClient
      .from("companies")
      .select("*")
      .eq("user_id", userCompany.id)
      .single();

    companyData = data ?? null;
  }

  if (userAgency) {
    const { data } = await agencyClient
      .from("agencies")
      .select("*")
      .eq("user_id", userAgency.id)
      .single();

    agencyData = data ?? null;
  }

  return {
    props: {
      plasmicData,
      component,
      userCompany: userCompany ?? null,
      userAgency: userAgency ?? null,
      companyData,
      agencyData,
    },
  };
};
