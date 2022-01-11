import React from "react";
import { Select } from "@chakra-ui/react";

const Select = ({ message }: { message: string }) => {
  return (
    <Select placeholder={message} size="lg" variant="filled">
      {array.map((item) => (
        <option value={}>{item}</option>
      ))}
    </Select>
  );
};

export default Select;
