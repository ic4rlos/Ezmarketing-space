import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .single();

    if (error) return res.status(400).json({ error });

    // 👇 IMPORTANTE: imitar o formato do Supabase REST
    return res.status(200).json({
      response: [data],
      statusCode: 200
    });
  }

  if (req.method === "POST") {
    const { data, error } = await supabase
      .from("companies")
      .upsert(req.body, { onConflict: "user_id" })
      .select()
      .single();

    if (error) return res.status(400).json({ error });

    return res.status(200).json({
      response: [data],
      statusCode: 200
    });
  }

  res.status(405).end();
}
