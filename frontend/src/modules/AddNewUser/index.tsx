import React from "react";
import { LoginWrapper, SubmitButton } from "../LoginAdmin/styles";
import { Heading, Flex, Box } from "@chakra-ui/react";
import { newUserField } from "../../consts";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TextInput } from "../../components/customcomponents/TextInput";
import { defaultUserValues } from "./interface";
import { adminLoginSchema } from "../../schemas/adminLoginSchema";
import { AdminLoginForm } from "../../types";
import axios from "axios";
import { useAxios } from "../../context/AxiosContext";

const AddNewUser = () => {
  const baseUrl = process.env.REACT_APP_SERVER_BASE_URL;
  const navigate = useNavigate();
  const axios = useAxios();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: defaultUserValues,
  });

  const handleRegisterUser = async (userForm: AdminLoginForm) => {
    try {
      await axios.post(`/auth/registerUser`, {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
      });
      navigate("/adminApp");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center">
      <LoginWrapper style={{ width: "50%", flexDirection: "column" }}>
        <Heading mt="6">Add new user</Heading>
        <form
          className="login-inputs"
          style={{ marginTop: "2.5rem", flex: 1 }}
          onSubmit={handleSubmit(handleRegisterUser)}
        >
          <Flex flexDirection="column" alignItems="center">
            <Box ml="2" mr="2" mb="6">
              {newUserField.map(({ placeholder, id }) => (
                <TextInput
                  key={id}
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
              Add New User
            </SubmitButton>
          </Flex>
        </form>
      </LoginWrapper>
    </Flex>
  );
};

export default AddNewUser;
