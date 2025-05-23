import Header from "@/components/Header";
import ListItems from "@/components/ListItem";
import getSongs from "@/actions/getSongs";
import PageContent from "./components/PageContent";
export const revalidate = 0;

export default async function Home() {
  const songs = await getSongs();

  // throw new Error("Error");

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-3xl font-semibold text-white">
            Music for everyone
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItems
              image="/images/liked.png"
              name="Liked Songs"
              href="liked"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-white">Newest Songs</h1>
        </div>
        <div>
          <PageContent songs={songs} />
        </div>
      </div>
    </div>
  );
}
