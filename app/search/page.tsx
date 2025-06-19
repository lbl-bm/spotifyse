import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import SearchContent from "./components/SearchContent";
import getSongsByTitle from "@/actions/getSongsByTitle";

interface SearchProps {
  searchParams: Promise<{
    title: string;
  }>;
}

export const revalidate = 0;

const Search = async ({ searchParams }: SearchProps) => {
  const resolvedSearchParams = await searchParams;
  const songs = await getSongsByTitle(resolvedSearchParams.title);
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-3xl text-white font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs}/>
    </div>
  );
};

export default Search;
