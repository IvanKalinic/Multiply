import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputProps,
} from "@chakra-ui/react";

import { FieldValues, DeepMap, FieldError } from "react-hook-form";

interface Props extends InputProps {
  /** Value shown above the input */
  title: string;
  placeholder: string;
  /** Determines the name of this field in the final submit object */
  registerName: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  errors: DeepMap<FieldValues, FieldError>;
}

/**
 * Component for a text input via react-hook-form
 *
 * @example
 * <ModalTextInput
 *  title='Input title'
 *  placeholder='Please enter a value...'
 *  registerName='inputValue'
 *  register={register}
 *  errors={errors}
 * />
 */
export const TextInput = (props: Props) => {
  const { title, placeholder, registerName, register, errors, ...styleProps } =
    props;

  return (
    <FormControl isInvalid={errors[registerName]} mt={3}>
      <FormLabel>{title}</FormLabel>

      <Input
        placeholder={placeholder}
        {...register(registerName)}
        errors={errors}
        {...styleProps}
      />

      <FormErrorMessage>{errors[registerName]?.message}</FormErrorMessage>
    </FormControl>
  );
};
