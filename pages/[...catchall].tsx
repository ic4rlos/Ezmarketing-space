import { GetServerSideProps } from "next";
import { PlasmicRootProvider, PlasmicComponent } from "@plasmicapp/react-web";
import { PLASMIC } from "../plasmic-init";

import { createClient } from "@supabase/supabase-js";

export default function CatchAllPage(props: any) {
  const { plasmicData, component, userData, companyData } = props;

  return (
    <PlasmicRootProvider loader={PLASMIC} prefetchedData={plasmicData}>
      <PlasmicComponent
        component={component}
        componentProps={{
          userData,
          companyData,
        }}
      />
    </PlasmicRootProvider>
  );
}
