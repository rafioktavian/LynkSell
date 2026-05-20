import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LynksellLandingClient from "@/components/landing/LynksellLandingClient";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }

  return <LynksellLandingClient />;
}
