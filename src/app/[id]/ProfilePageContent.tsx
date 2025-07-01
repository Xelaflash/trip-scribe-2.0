"use client";

import { Suspense, useState } from "react";
import * as z from "zod";

// Types
import type { Trip } from "@prisma/client";
import { UserWithTrips } from "@/types/user";

// custom hooks
import { useCurrentUser } from "@/hooks/useCurrentUser";
// UI
import AutoForm, { AutoFormSubmit } from "@/components/ui/auto-form";
import { TripList } from "@/components/trip-list";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createTrip } from "@/queries/tripQueries";

const createTripSchema = z.object({
  title: z.string(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  destinations: z.string(),
  visibility: z.enum(["PUBLIC", "PRIVATE"]),
});
function ProfilePageContent() {
  const [open, setOpen] = useState(false);

  const currentUser = useCurrentUser() as UserWithTrips;

  const handleCreateTrip = async (data: any) => {
    console.log(data);
    const destinationsData = data.destinations?.split(",");
    await createTrip({
      ...data,
      // todo: fix ts error
      destinations: destinationsData,
    });
    setOpen(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="text-md my-2 hover:opacity-90 inline-flex items-center justify-center rounded-md text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 p-4">
          Create a new Trip
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl mb-0 flex justify-center">
              Create a trip
            </DialogTitle>
            <DialogDescription className="text-md mt-0 flex justify-center">
              Start your journey
            </DialogDescription>
          </DialogHeader>
          <AutoForm
            formSchema={createTripSchema}
            onSubmit={(data) => {
              handleCreateTrip(data);
            }}
            fieldConfig={{
              destinations: {
                description:
                  "Enter the destinations you are planning to visit. Comma separated",
              },
              visibility: {
                description:
                  "Make your trip public or private (check for private)",
              },
            }}
          >
            <DialogFooter>
              <AutoFormSubmit>Create</AutoFormSubmit>
            </DialogFooter>
          </AutoForm>
        </DialogContent>
      </Dialog>
      {currentUser?.trips?.length === 0 ? (
        <p className="text-red-500 text-lg flex justify-center">No trips yet</p>
      ) : (
        <Suspense fallback={<p>Loading...</p>}>
          <TripList userTrips={currentUser?.trips} />
        </Suspense>
      )}
    </>
  );
}

export { ProfilePageContent };
