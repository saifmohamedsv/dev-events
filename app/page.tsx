import EventList from "@/components/event-list";
import { ExploreBtn } from "@/components/shared";
import { Suspense } from "react";

export default function Home() {
  return (
    <section>
      <h1 className="text-center">
        The Hub for every Dev <br /> Event You Can&apos;t Miss.
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and Conferences, All in One Place
      </p>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
        <Suspense fallback={<div>Loading...</div>}>
          <EventList />
        </Suspense>
      </div>
    </section>
  );
}
