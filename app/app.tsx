import { createContext } from "react";
export const StateContext = createContext<any>({});

export const capitalizeAllWords = (string: any) => {
    if (string != null || string != undefined) {
      return string.replace(`  `,` `).split(` `).map((word: any) => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join();
    }
  };