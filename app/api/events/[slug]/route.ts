import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { Error as MongooseError } from "mongoose";

// Type-safe context for dynamic route parameters
interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * GET /api/events/[slug]
 * Fetches a single event by its unique slug
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  try {
    // Establish database connection
    await connectDB();

    // Extract and validate slug parameter
    const { slug } = await context.params;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Slug parameter is required and must be a string",
        },
        { status: 400 }
      );
    }

    // Sanitize slug (trim whitespace and convert to lowercase)
    const sanitizedSlug = slug.trim().toLowerCase();

    // Validate slug format (alphanumeric and hyphens only)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(sanitizedSlug)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid slug format. Slug must contain only lowercase letters, numbers, and hyphens",
        },
        { status: 400 }
      );
    }

    // Query event by slug (findOne returns single document or null)
    const event = await Event.findOne({ slug: sanitizedSlug }).lean().exec();

    // Handle event not found
    if (!event) {
      return NextResponse.json(
        {
          success: false,
          message: `Event with slug '${sanitizedSlug}' not found`,
        },
        { status: 404 }
      );
    }

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        message: "Event fetched successfully",
        data: event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching event by slug:", error);

    // Handle Mongoose validation errors
    if (error instanceof MongooseError.ValidationError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          error: error.message,
        },
        { status: 422 }
      );
    }

    // Handle Mongoose cast errors (e.g., invalid ObjectId format)
    if (error instanceof MongooseError.CastError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid data format",
          error: error.message,
        },
        { status: 400 }
      );
    }

    // Handle generic errors
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch event",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
