import { Flex, Box } from "@chakra-ui/react";
import { TextInput } from "../../../../components/customcomponents/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRegisterSchema } from "../../../../schemas/adminRegisterSchema";
import { defaultAdminValues } from "../../interface";
import { requiredFields } from "../../../../consts";
import { SubmitButton } from "../../styles";
import { AdminRegisterForm } from "../../../../types";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminRegisterSchema),
    defaultValues: defaultAdminValues,
  });

  const handleRegister = async (adminForm: AdminRegisterForm) => {
    console.log(adminForm);
  };

  return (
    <form
      className="register-inputs"
      style={{ flex: 1 }}
      onSubmit={handleSubmit(handleRegister)}
    >
      <Flex flexDirection="column" alignItems="center">
        <Box ml="2" mr="2" mb="6">
          {requiredFields.map(({ placeholder, id }) => (
            <TextInput
              type={id}
              placeholder={placeholder}
              id={id}
              title={placeholder}
              registerName={id}
              register={register}
              errors={errors}
            />
          ))}
          <TextInput
            type="password"
            placeholder="Password"
            title="Password"
            id="passwordAgain"
            registerName="passwordAgain"
            register={register}
            errors={errors}
          />
        </Box>
        <SubmitButton login={false} type="submit">
          Register
        </SubmitButton>
      </Flex>
    </form>
  );
};

export default Register;
