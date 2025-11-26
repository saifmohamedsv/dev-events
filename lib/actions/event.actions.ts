"use server";

import Event from "@/database/event.model";
import connectDB from "@/lib/mongodb";

import { IEvent } from "@/database";

export const getSimilarEventsBySlug = async (
  slug: string
): Promise<IEvent[]> => {
  try {
    await connectDB();
    const event = await Event.findOne({ slug });
    if (!event) {
      return [];
    }

    return (await Event.find({
      _id: { $ne: event._id },
      tags: { $in: event.tags },
    }).lean()) as unknown as IEvent[];
  } catch {
    return [];
  }
};
