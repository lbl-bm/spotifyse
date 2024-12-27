import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getLikedSongs = async (): Promise<Song[]> => {

  // 创建 Supabase 客户端

  const supabase = createServerComponentClient({

    cookies: cookies,

  });

  // 获取当前用户的会话信息

  const { data:{
    session,
  } } = await supabase.auth.getSession();

  // 从 "songs" 表中选择所有歌曲，并按创建时间降序排列

  const { data, error } = await supabase
  .from("liked_songs")
  .select("*, songs(*)")
  .eq("user_id", session?.user?.id)
  .order("created_at", { ascending: false });


  // 如果发生错误，打印错误信息

  if (error) {
    console.log(error);
    return [] ;
  }

  if(!data) {
    return [];
  }

  // 返回歌曲数据，如果没有数据则返回空数组
  return data.map((item) => ({ ...item.songs })) as Song[];
}

export default getLikedSongs;
