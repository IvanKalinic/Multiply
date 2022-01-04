import { Flex, Box } from "@chakra-ui/react";
import { TextInput } from "../../../../components/customcomponents/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../../../schemas/adminLoginSchema";
import { useForm } from "react-hook-form";
import { defaultAdminValues } from "../../interface";
import { requiredFields } from "../../../../consts";
import { SubmitButton } from "../../styles";
import { AdminLoginForm } from "../../../../types";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: defaultAdminValues,
  });

  const handleLogin = async (adminForm: AdminLoginForm) => {
    console.log(adminForm);
  };

  return (
    <form
      className="login-inputs"
      style={{ marginTop: "40px", flex: 1 }}
      onSubmit={handleSubmit(handleLogin)}
    >
      <Flex flexDirection="column" alignItems="center">
        <Box ml="2" mr="2" mb="6">
          {requiredFields.map(({ placeholder, id }) => (
            <TextInput
              title={placeholder}
              registerName={id}
              type={id}
              placeholder={placeholder}
              id={id}
              register={register}
              errors={errors}
            />
          ))}
        </Box>
        <SubmitButton login type="submit">
          Login
        </SubmitButton>
      </Flex>
    </form>
  );
};

export default Login;
