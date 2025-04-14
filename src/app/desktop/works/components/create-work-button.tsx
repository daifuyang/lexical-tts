'use client'

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export function CreateWorkButton() {
  const router = useRouter();

  return (
    <Button 
      onClick={() => router.push('/editor')}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
    >
      <Plus className="h-4 w-4 mr-2" />
      创建作品
    </Button>
  );
}
