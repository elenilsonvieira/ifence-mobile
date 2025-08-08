import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { daltonicColors, defaultColors } from "../constants/DaltonicColors";

export function useDaltonicColors() {
  const [colors, setColors] = useState(defaultColors);

  useEffect(() => {
    (async () => {
      const value = await AsyncStorage.getItem("daltonicMode");
      setColors(value === "true" ? daltonicColors : defaultColors);
    })();
  }, []);

  return colors;
}
