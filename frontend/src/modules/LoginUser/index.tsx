import React from "react";
import { LoginWrapper, SubmitButton } from "../LoginAdmin/styles";
import { Heading, Flex, Box } from "@chakra-ui/react";
import { requiredFields } from "../../consts";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/customcomponents/TextInput";
import { defaultUserValues } from "./interface";
import { adminLoginSchema } from "../../schemas/adminLoginSchema";
import { AdminLoginForm } from "../../types";
import axios from "axios";
import { useAxios } from "../../context/AxiosContext";

const LoginUser = ({
  setId,
}: {
  setId: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const navigate = useNavigate();
  const axios = useAxios();
  const { setUser } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: defaultUserValues,
  });

  const handleLogin = async (userForm: AdminLoginForm) => {
    try {
      const newUser = await axios.post(`/auth/userlogin`, {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
      });
      setId(userForm.password);
      setUser(newUser);
      // navigate("/userApp");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <LoginWrapper style={{ width: "50%", flexDirection: "column" }}>
        <Heading mt="6">Login with your credentials</Heading>
        <form
          className="login-inputs"
          style={{ marginTop: "2.5rem", flex: 1 }}
          onSubmit={handleSubmit(handleLogin)}
        >
          <Flex flexDirection="column" alignItems="center">
            <Box ml="2" mr="2" mb="6">
              {requiredFields.map(({ placeholder, id }) => (
                <TextInput
                  key={`loginUser-${id}`}
                  title={placeholder}
                  registerName={id}
                  type={id}
                  placeholder={placeholder}
                  _placeholder={{ color: "gray.600" }}
                  id={`loginUser-${id}`}
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
      </LoginWrapper>
    </Flex>
  );
};

export default LoginUser;
