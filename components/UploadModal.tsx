"use client";
import uniqid from "uniqid";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useState } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";

import { useUser } from "@/hooks/useUser";
import useUploadModal from "@/hooks/useUploadModal";


const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter();

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values: FieldValues) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      // 检查歌曲文件类型是否为MP3
      const isMP3 = songFile.name.toLowerCase().endsWith(".mp3");
      if (!isMP3) {
        toast.error("请上传有效的MP3文件");
        return;
      }

      // 检查图片文件类型
      const isImage = imageFile.name.toLowerCase().match(/\.(jpeg|jpg|png)$/);
      if (!isImage) {
        toast.error("请上传有效的图像文件");
        return;
      }

      // 生成唯一ID
      const uniqueID = uniqid();

      const encodeTitle = (title: string) => {
        return Buffer.from(title).toString('base64');
      };

      const base64Title = /[\u4e00-\u9fa5]/.test(values.title) ? encodeTitle(values.title) : values.title;

      const songKey = `song-${base64Title}-${uniqueID}`;
      const imageKey = `image-${base64Title}-${uniqueID}`;

      // 上传歌曲
      const { data: songData, error: songError } = await supabaseClient.storage
        .from("songs")
        .upload(songKey, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        console.log("Song upload failed:", songError);
        setIsLoading(false);
        return toast.error("Failed to upload song");
      }

      // 上传图片
      const { data: imageData, error: imageError } = await supabaseClient.storage
        .from("images")
        .upload(imageKey, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        console.error("Image upload failed:", imageError);
        setIsLoading(false);
        return toast.error("Failed to upload image");
      }

      // 插入数据库记录
      const { error: supabaseError } = await supabaseClient
        .from("songs")
        .insert({
          user_id: user.id,
          title: values.title,
          author: values.author,
          image_path: imageData.path,
          song_path: songData.path,
        });

      if (supabaseError) {
        console.error("Database insert failed:", supabaseError);
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      // 刷新页面，清理状态并关闭模态框
      router.refresh();
      setIsLoading(false);
      toast.success("Song uploaded successfully");
      reset();
      uploadModal.onClose();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("上传失败: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Song title"
        />
        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Song author"
        />
        <div>
          <div className="pb-1">Select a song file</div>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>
        <div>
          <div className="pb-1">Select an image</div>
          <Input
            id="image"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          Create
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
