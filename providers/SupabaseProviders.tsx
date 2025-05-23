"use client";

import {useState} from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types_db";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

interface SupabaseProciderProps{
  children: React.ReactNode;
}

const SupabaseProvider: React.FC<SupabaseProciderProps> = ({children}) => {
  const [supabaseClient] = useState(() => 
  createClientComponentClient<Database>()
  );

  return(
    <SessionContextProvider supabaseClient={supabaseClient}>
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseProvider;
