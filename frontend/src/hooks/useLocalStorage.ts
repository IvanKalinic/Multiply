import { useEffect, useState } from "react";

const useLocalStorage = (key: string, initialValue?: any) => {
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem(key);
    return jsonValue && jsonValue !== undefined && jsonValue !== null
      ? JSON.parse(jsonValue)
      : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
