import { DottedSeparator } from "@/components/DottedSeparator";
import { View, ViewTitle } from "@/components/ui/view";
import { WorkspaceAddCard } from "@/features/workspaces";
import { WorkspaceList } from "./client";

export default async function Home() {  
  return (
    <View>
      <ViewTitle>Dashboard</ViewTitle>
      <DottedSeparator className="my-3" />
      
      {/* Відображаємо workspace карточки, передаючи тільки ID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <WorkspaceList />
        <WorkspaceAddCard />
      </div>
    </View>
  )
}
