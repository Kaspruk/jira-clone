"use client";

import { LuLoader } from "react-icons/lu";

const LoadingPage = () => {
  return ( 
    <div className="h-screen w-screen flex flex-col items-center justify-center">
      <LuLoader className="size-6 animate-spin text-muted-foreground" />
    </div>
  );
};
 
export default LoadingPage;
