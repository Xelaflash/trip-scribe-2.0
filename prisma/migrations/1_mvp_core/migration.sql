ALTER TABLE "Trip" ADD COLUMN "description" TEXT;

ALTER TABLE "Trip" DROP CONSTRAINT "Trip_userId_fkey";
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "ItineraryItem" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ItineraryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripNote" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TripPlace" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT,
    "address" TEXT,
    "url" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripPlace_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "Trip_userId_idx" ON "Trip"("userId");
CREATE INDEX "Trip_visibility_idx" ON "Trip"("visibility");
CREATE INDEX "ItineraryItem_tripId_startsAt_idx" ON "ItineraryItem"("tripId", "startsAt");
CREATE INDEX "TripNote_tripId_updatedAt_idx" ON "TripNote"("tripId", "updatedAt");
CREATE INDEX "TripPlace_tripId_name_idx" ON "TripPlace"("tripId", "name");
CREATE UNIQUE INDEX "ItineraryItem_id_tripId_key" ON "ItineraryItem"("id", "tripId");
CREATE UNIQUE INDEX "TripNote_id_tripId_key" ON "TripNote"("id", "tripId");
CREATE UNIQUE INDEX "TripPlace_id_tripId_key" ON "TripPlace"("id", "tripId");

ALTER TABLE "ItineraryItem" ADD CONSTRAINT "ItineraryItem_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripNote" ADD CONSTRAINT "TripNote_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TripPlace" ADD CONSTRAINT "TripPlace_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
