import { Box, Flex } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../../../components/customcomponents/TextInput";
import { requiredFields } from "../../../../consts";
import { useAdmin } from "../../../../context/AdminContext";
import { useAxios } from "../../../../context/AxiosContext";
import { userLoginSchema } from "../../../../schemas/adminLoginSchema";
import { UserLoginForm } from "../../../../types";
import { SubmitButton } from "../../styles";

const Login = ({
  setId,
}: {
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { setAdmin } = useAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleLogin = async (adminForm: UserLoginForm) => {
    try {
      const newAdmin = await axios.post(`/auth/loginAdmin`, {
        username: adminForm.username,
        password: adminForm.password,
      });
      setId(adminForm.password);
      setAdmin(newAdmin);
      navigate("/adminApp");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form
      className="login-inputs"
      style={{ marginTop: "2.5rem", flex: 1 }}
      onSubmit={handleSubmit(handleLogin)}
    >
      <Flex flexDirection="column" alignItems="center">
        <Box ml="2" mr="2" mb="6">
          {requiredFields.map(
            ({ placeholder, id }) =>
              placeholder !== "Email" && (
                <TextInput
                  key={`login-${id}`}
                  title={placeholder}
                  registerName={id}
                  type={id}
                  placeholder={placeholder}
                  _placeholder={{ color: "gray.600" }}
                  id={`login-${id}`}
                  register={register}
                  errors={errors}
                  color="black"
                />
              )
          )}
        </Box>
        <SubmitButton login type="submit">
          Login
        </SubmitButton>
      </Flex>
    </form>
  );
};

export default Login;
