CREATE TABLE "TripDestination" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "mapboxId" TEXT,
    "featureType" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TripDestination_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "TripPlace" ADD COLUMN "mapboxId" TEXT;
ALTER TABLE "TripPlace" ADD COLUMN "featureType" TEXT;

CREATE UNIQUE INDEX "TripDestination_id_tripId_key" ON "TripDestination"("id", "tripId");
CREATE INDEX "TripDestination_tripId_sortOrder_idx" ON "TripDestination"("tripId", "sortOrder");

ALTER TABLE "TripDestination" ADD CONSTRAINT "TripDestination_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "TripDestination" ("id", "tripId", "label", "sortOrder", "createdAt", "updatedAt")
SELECT md5("Trip"."id" || ':' || destination.sort_order::text), "Trip"."id", destination.label, destination.sort_order - 1, NOW(), NOW()
FROM "Trip"
CROSS JOIN LATERAL unnest("Trip"."destinations") WITH ORDINALITY AS destination(label, sort_order)
WHERE trim(destination.label) <> '';
