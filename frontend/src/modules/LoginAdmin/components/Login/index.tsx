import { Flex, Box } from "@chakra-ui/react";
import { TextInput } from "../../../../components/customcomponents/TextInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminLoginSchema } from "../../../../schemas/adminLoginSchema";
import { useForm } from "react-hook-form";
import { defaultAdminValues } from "../../interface";
import { requiredFields } from "../../../../consts";
import { SubmitButton } from "../../styles";
import { AdminLoginForm } from "../../../../types";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../../../../context/AdminContext";
import axios from "axios";

const Login = () => {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const navigate = useNavigate();
  const { setAdmin } = useAdmin();
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
    try {
      const newAdmin = await axios.post(`${baseUrl}/auth/loginAdmin`, {
        username: adminForm.username,
        email: adminForm.email,
        password: adminForm.password,
      });
      setAdmin(newAdmin);
      navigate("/adminApp");
    } catch (err) {
      console.log(err);
    }
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
              _placeholder={{ color: "gray.600" }}
              id={id}
              register={register}
              errors={errors}
              color="black"
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
