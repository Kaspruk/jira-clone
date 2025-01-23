import * as React from "react";
import { Editable as SlateEditable } from "slate-react";

const Editable = React.forwardRef<
    HTMLInputElement, 
    React.ComponentProps<typeof SlateEditable>
>(
  (props, ref) => {
    return (
      <SlateEditable
        ref={ref}
        className="flex w-full min-h-12 px-3 py-3 text-sm rounded-md border border-input bg-transparent shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...props}
      />
    );
  }
);

Editable.displayName = "Editable";

export { Editable }
