import { Flex, Box } from "@chakra-ui/react";
import { TextInput } from "../../../../components/customcomponents/TextInput";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminRegisterSchema } from "../../../../schemas/adminRegisterSchema";
import { defaultAdminValues } from "../../interface";
import { requiredFields } from "../../../../consts";
import { SubmitButton } from "../../styles";
import { AdminRegisterForm } from "../../../../types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAxios } from "../../../../context/AxiosContext";

const Register = () => {
  const navigate = useNavigate();
  const axios = useAxios();

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
    try {
      await axios.post(`/auth/register`, {
        username: adminForm.username,
        email: adminForm.email,
        password: adminForm.password,
      });
      navigate("/adminApp");
    } catch (err) {
      console.log(err);
    }
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
              key={`register-${id}`}
              type={id}
              placeholder={placeholder}
              _placeholder={{ color: "gray.600" }}
              id={`register-${id}`}
              title={placeholder}
              registerName={id}
              register={register}
              errors={errors}
            />
          ))}
          <TextInput
            type="password"
            placeholder="Repeat Password"
            _placeholder={{ color: "gray.600" }}
            title="Repeat Password"
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
