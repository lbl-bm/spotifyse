import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongsByUserId = async (): Promise<Song[]> => {
  // 创建 Supabase 客户端
  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  if (!sessionData.session) {
    return []; // 确保 session 存在
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.session.user.id) // 这里可以安全地访问 user
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as Song[]) || [];
};

export default getSongsByUserId;
