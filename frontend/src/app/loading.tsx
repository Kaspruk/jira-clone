import { LuLoader } from "react-icons/lu";

const LoadingPage = () => {
  return ( 
    <div className="h-screen w-screen flex flex-col items-center justify-center animate-fade-scale">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <LuLoader className="size-8 animate-spin text-primary" />
        </div>
        <div className="text-sm text-muted-foreground animate-slide-up delay-200">
          Завантаження...
        </div>
      </div>
    </div>
  );
};
 
export default LoadingPage;
