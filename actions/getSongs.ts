import { Song } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getSongs = async (): Promise<Song[]> => {

  // 创建 Supabase 客户端

  const supabase = createServerComponentClient({

    cookies: cookies,

  });


  // 从 "songs" 表中选择所有歌曲，并按创建时间降序排列

  const { data, error } = await supabase.from("songs").select("*").order("created_at", { ascending: false });


  // 如果发生错误，打印错误信息

  if (error) {

    console.log(error);

  }


  // 返回歌曲数据，如果没有数据则返回空数组
  return (data as Song[]) || [];

}

export default getSongs;
