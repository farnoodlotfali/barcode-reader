"use client";

import { INPUT_TYPES } from "@/constants/InputType";
import { Box, Card, Container, Fade, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { FormContainer, FormInputs } from "../form";
import { LoadingButton } from "@mui/lab";
import LoginIcon from "@mui/icons-material/Login";
import { LOGIN_STEPS } from "@/constants/loginSteps";
import { useAuthStore } from "@/context/features/auth";
import { useShallow } from "zustand/react/shallow";
import PasswordIcon from "@mui/icons-material/Password";
import { simpleAxiosApi } from "@/api/axiosApi";
import { EndPoints } from "@/constants/EndPoints";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { enToFaNumber } from "@/utility/utils";
import { useRouter } from "next/navigation";
import { PagesUrls } from "@/constants/PagesUrl";

const LoginCard = () => {
  const [phone, handlePhone, handleStep] = useAuthStore(
    useShallow((state) => [state.phone, state.handlePhone, state.handleStep])
  );

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: { mobile: phone },
  });

  const Inputs = [
    {
      type: INPUT_TYPES.NUMBER,
      name: "mobile",
      label: "شماره موبایل",
      control: control,
      rules: {
        required: "شماره موبایل را وارد کنید",
      },
    },
  ];

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await simpleAxiosApi({
        url: EndPoints.Login,
        method: "post",
        data: JSON.stringify(data),
      });
      toast.success(res.data.Message);

      handlePhone(data.mobile);
      handleStep(LOGIN_STEPS.VERIFY);
    } catch (error) {}
  };

  return (
    <Card
      sx={{
        p: 2,
      }}
    >
      <Typography textAlign="center">
        <LoginIcon
          color="secondary"
          sx={{
            fontSize: 50,
          }}
        />
      </Typography>

      <Typography fontWeight={500} variant="h5" textAlign="center">
        ورود
      </Typography>

      <Box component="form" mt={8} onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} size={{ md: 12 }} spacing={4} />

          <Stack mt={2}>
            <LoadingButton
              fullWidth
              sx={{ py: 1.5 }}
              variant="contained"
              color="primary"
              type="submit"
              loading={isSubmitting}
            >
              ارسال کد
            </LoadingButton>
          </Stack>
        </FormContainer>
      </Box>
    </Card>
  );
};

const VerifyCard = () => {
  const router = useRouter();
  const [phone, handleStep, reset] = useAuthStore(
    useShallow((state) => [state.phone, state.handleStep, state.reset])
  );
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const Inputs = [
    {
      type: INPUT_TYPES.NUMBER,
      name: "verificationCode",
      label: "کد چهار رقمی",
      control: control,
      rules: {
        required: "کد را وارد کنید",
      },
    },
  ];

  const handleBack = () => {
    handleStep(LOGIN_STEPS.LOGIN);
  };

  // handle on change inputs
  const handleChange = (name, value) => {
    setValue(name, value);
  };

  // handle on submit
  const onSubmit = async (data) => {
    try {
      const res = await simpleAxiosApi({
        url: EndPoints.Verify,
        method: "post",
        data: JSON.stringify({
          ...data,
          mobile: phone,
        }),
      });
      toast.success(res.data.Message);

      Cookies.set("token", res.data.Data.token, {
        expires: 30,
      });
      Cookies.set("refreshToken", res.data.Data.refreshToken, {
        expires: 30,
      });
      localStorage.setItem("user", JSON.stringify(res.data.Data.profile));
      router.push(PagesUrls.Home).then(() => {
        reset();
      });
    } catch (error) {}
  };

  return (
    <Card
      sx={{
        p: 2,
      }}
    >
      <Typography textAlign="center">
        <PasswordIcon
          color="secondary"
          sx={{
            fontSize: 50,
          }}
        />
      </Typography>

      <Typography fontWeight={500} variant="h5" textAlign="center">
        کد یکبار مصرف
      </Typography>

      <Box component="form" mt={8} onSubmit={handleSubmit(onSubmit)}>
        <FormContainer data={watch()} setData={handleChange} errors={errors}>
          <FormInputs inputs={Inputs} size={{ md: 12 }} spacing={4} />

          <Stack mt={2}>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 500,
                color: "info.main",
                cursor: "pointer",
                mb: 1,
                ":hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={handleBack}
            >
              تغییر شماره {enToFaNumber(phone)}
            </Typography>
            <LoadingButton
              fullWidth
              sx={{ py: 1.5 }}
              variant="contained"
              color="primary"
              type="submit"
              loading={isSubmitting}
            >
              ورود
            </LoadingButton>
          </Stack>
        </FormContainer>
      </Box>
    </Card>
  );
};

const LoginScreen = () => {
  const [step, show] = useAuthStore(
    useShallow((state) => [state.step, state.show])
  );

  const ALL_STEPS = {
    [LOGIN_STEPS.LOGIN]: <LoginCard />,
    [LOGIN_STEPS.VERIFY]: <VerifyCard />,
  };
  return (
    <Container
      sx={{
        display: "flex",
        mt: 10,
      }}
      maxWidth="xs"
    >
      <Fade in={show} timeout={200}>
        <Box width="100%">{ALL_STEPS[step]}</Box>
      </Fade>
    </Container>
  );
};

export default LoginScreen;
