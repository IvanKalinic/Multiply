import { Box, Flex, Heading } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TextInput } from "../../components/customcomponents/TextInput";
import SelectDropdown from "../../components/Select";
import { listOfClasses, newUserField } from "../../consts";
import { useAxios } from "../../context/AxiosContext";
import { adminLoginSchema } from "../../schemas/adminLoginSchema";
import { AdminLoginForm } from "../../types";
import { LoginWrapper, SubmitButton } from "../LoginAdmin/styles";
import { defaultUserValues } from "./interface";

const AddNewUser = () => {
  const navigate = useNavigate();
  const axios = useAxios();
  const [selectedOptions, setSelectedOptions] = useState<{ class: string }>({
    class: "",
  });

  const {
    register,
    handleSubmit,
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
        class: selectedOptions.class,
      });
      navigate("/adminApp");
    } catch (err) {
      console.log(err);
    }
  };

  console.log(selectedOptions);
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
            <Box ml="2" mr="2" mb="6">
              <SelectDropdown
                message="Select user's class"
                array={listOfClasses}
                setSelectedOptions={setSelectedOptions}
                selectedOptions={selectedOptions}
                selection="class"
              />
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
