import { Navbar } from "@/components/ui/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";
import CreateNeedForm from "@/components/needs/create-need-form";

export default async function CreateNeedPage() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Publier un besoin</CardTitle>
              <CardDescription>
                Décrivez ce dont vous avez besoin et les volontaires vous aideront
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateNeedForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
