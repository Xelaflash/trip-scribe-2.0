import { redirect } from "next/navigation";

// auth
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

// Components
import { ProfilePageContent } from "./ProfilePageContent";

export default async function Page({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || session?.user.id !== params.id) {
    redirect("/");
  }

  // TODO: CRUD trip
  // CREATE ✅
  // READ ✅
  // UPDATE
  // DELETE

  return (
    <main className="p-10">
      <h1 className="flex justify-center mb-2">
        {session.user.name}&apos;s Trips
      </h1>
      <ProfilePageContent />
    </main>
  );
}
