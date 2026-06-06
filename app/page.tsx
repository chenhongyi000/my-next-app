import Header from "@/app/_components/Header";
import PostList from "@/app/_components/PostList";
import ChartsSection from "@/app/_components/ChartsSection";
import Footer from "@/app/_components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Header />
      <main className="flex-1">
        <PostList />
        <ChartsSection />
      </main>
      <Footer />
    </div>
  );
}
