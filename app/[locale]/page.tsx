import Header from "@/app/_components/Header";
import PostList from "@/app/_components/PostList";
import Footer from "@/app/_components/Footer";

export const dynamic = "force-dynamic";

export default function Home() {

  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PostList />
      </main>
      <Footer />
    </div>
  );
}
