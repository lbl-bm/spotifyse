"use client"

import qs from "query-string";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";

import useDebounce from "@/hooks/useDebounce";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value,setValue] = useState("");
  const debouncedValue = useDebounce<string>(value,500);

useEffect(() => {
  const query = {
    title: debouncedValue,
  };

  const url = qs.stringifyUrl({
    url: "/search",
    query,
  });
  router.push(url);
},[debouncedValue,router])

  return (
    <Input
    placeholder="what do you want to listen to?"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    />
  )
 
}

export default SearchInput;