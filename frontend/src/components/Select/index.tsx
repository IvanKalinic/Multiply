import React, { useState } from "react";
import { Select } from "@chakra-ui/react";
import { string } from "zod";

type Props = {
  message: string;
  array: any;
  selectedOptions: any;
  setSelectedOptions: React.Dispatch<any>;
  selection: string;
};

const SelectDropdown = ({
  message,
  array,
  setSelectedOptions,
  selectedOptions,
  selection,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<any>) => {
    if (selection === "opponents") {
      const number = message.includes("1") ? 0 : 1;
      let aggArray = selectedOptions.opponents;
      aggArray[number] = e.target.value;
      setSelectedOptions({
        ...selectedOptions,
        [selection]: aggArray,
      });
      return;
    }
    setSelectedOptions({
      ...selectedOptions,
      [selection]: e.target.value,
    });
  };

  return (
    <Select
      placeholder={message}
      size="lg"
      variant="filled"
      onChange={(e) => handleChange(e)}
    >
      {array.map(({ category, value }: { category: string; value: number }) => (
        <option value={category} key={value}>
          {category}
        </option>
      ))}
    </Select>
  );
};

export default SelectDropdown;
