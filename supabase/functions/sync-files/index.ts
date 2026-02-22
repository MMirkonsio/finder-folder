import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface FileData {
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  owner_user: string;
  last_modified: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Faltan variables de entorno de Supabase");
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (req.method === "POST") {
      const { files } = await req.json() as { files: FileData[] };

      if (!files || !Array.isArray(files)) {
        return new Response(
          JSON.stringify({ error: "Se requiere un array de archivos" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const batchSize = 1000;
      let totalProcessed = 0;
      let totalInserted = 0;
      let totalUpdated = 0;

      for (let i = 0; i < files.length; i += batchSize) {
        const batch = files.slice(i, i + batchSize);

        for (const file of batch) {
          const { data: existing } = await supabase
            .from("files_index")
            .select("id, last_modified")
            .eq("file_path", file.file_path)
            .maybeSingle();

          if (existing) {
            const existingModified = new Date(existing.last_modified).getTime();
            const newModified = new Date(file.last_modified).getTime();

            if (newModified > existingModified) {
              const { error } = await supabase
                .from("files_index")
                .update({
                  file_name: file.file_name,
                  file_size: file.file_size,
                  file_type: file.file_type,
                  owner_user: file.owner_user,
                  last_modified: file.last_modified,
                })
                .eq("id", existing.id);

              if (!error) totalUpdated++;
            }
          } else {
            const { error } = await supabase
              .from("files_index")
              .insert({
                file_name: file.file_name,
                file_path: file.file_path,
                file_size: file.file_size,
                file_type: file.file_type,
                owner_user: file.owner_user,
                last_modified: file.last_modified,
              });

            if (!error) totalInserted++;
          }

          totalProcessed++;
        }
      }

      const { error: configError } = await supabase
        .from("server_config")
        .update({
          last_scan: new Date().toISOString(),
          total_files: totalProcessed,
        })
        .limit(1);

      if (configError) {
        console.error("Error actualizando configuración:", configError);
      }

      return new Response(
        JSON.stringify({
          success: true,
          processed: totalProcessed,
          inserted: totalInserted,
          updated: totalUpdated,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (req.method === "GET") {
      const { data: config } = await supabase
        .from("server_config")
        .select("*")
        .maybeSingle();

      const { count } = await supabase
        .from("files_index")
        .select("*", { count: "exact", head: true });

      return new Response(
        JSON.stringify({
          config,
          total_files: count || 0,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Método no permitido" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error en sync-files:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
