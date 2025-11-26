import EventDetails from "@/components/event-details";
import { Suspense } from "react";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  "use cache";
  const { slug } = await params;

  return (
    <main>
      <Suspense fallback={<div>Loading...</div>}>
        <EventDetails slug={slug} />
      </Suspense>
    </main>
  );
};

export default Page;
