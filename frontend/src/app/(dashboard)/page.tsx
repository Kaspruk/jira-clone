import Link from "next/link";
import { DottedSeparator } from "@/components/DottedSeparator";
import { View, ViewTitle } from "@/components/ui/view";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <View>
      <ViewTitle>Dashboard</ViewTitle>
      <DottedSeparator className="my-3" />
      {/* <h2 className="text-2xl font-bold mb-4">
        Your job
      </h2>
      <ViewHeader className="flex flex-nowrap justify-between mb-3">
        <Button variant="ghost" size="sm" asChild>
          <Link href="projects">See all projects</Link>
        </Button>
      </ViewHeader>
      <DottedSeparator className="mb-3" />
      <ViewContent>
        Content
      </ViewContent> */}
    </View>
  )
};

// import { getCurrent } from "@/features/auth/queries";
// import { getWorkspaces } from "@/features/workspaces/queries";

// export default async function Home() {
//   const user = await getCurrent();
//   if (!user) redirect("/sign-in");

//   const workspaces = await getWorkspaces();
//   if (workspaces.total === 0) {
//     redirect("/workspaces/create");
//   } else {
//     redirect(`/workspaces/${workspaces.documents[0].$id}`);
//   }
// };
