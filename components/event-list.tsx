import { IEvent } from "@/database";
import { EventCard } from "./event-card";
import { BASE_URL } from "@/lib/constants";
import { cacheLife } from "next/cache";

async function EventList() {
  "use cache";
  cacheLife("hours");
  let events;

  try {
    const response = await fetch(`${BASE_URL}/api/events`);
    const { events: data } = await response.json();
    events = data;
  } catch (error) {
    console.error("Error fetching event:", error);
  }

  return (
    <ul className="events">
      {events &&
        events.length > 0 &&
        events.map((event: IEvent) => (
          <li key={event.slug} className="list-none">
            <EventCard {...event} />
          </li>
        ))}
    </ul>
  );
}

export default EventList;
