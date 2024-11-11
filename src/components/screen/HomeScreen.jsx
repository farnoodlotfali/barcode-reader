"use client";

import {
  Box,
  Card,
  Container,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import { Scanner } from "@yudiel/react-qr-scanner";
import { FormContainer, FormInputs } from "../form";
import { LoadingButton } from "@mui/lab";
import { INPUT_TYPES } from "@/constants/InputType";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EndPoints } from "@/constants/EndPoints";
import { axiosApi } from "@/api/axiosApi";
import { useState } from "react";
import { enToFaNumber } from "@/utility/utils";
import {BarcodeScanner} from '@thewirv/react-barcode-scanner';

const InfoItem = ({ title, info }) => {
  return (
    <Stack fontSize={13} direction="row" alignItems="center" spacing={0.5}>
      <Typography fontSize="inherit" fontWeight={600}>
        {title}:
      </Typography>
      <Typography fontSize="inherit">{info ?? "-"}</Typography>
    </Stack>
  );
};

const HomeScreen = () => {
  const [data, setData] = useState("No result");
  const [info, setInfo] = useState(null);
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
      label: "کد",
      control: control,
      rules: {
        required: "کد را وارد کنید",
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
      const res = await axiosApi({
        url: EndPoints.Parcel,
        method: "post",
        data: JSON.stringify(data),
      });
      toast.success(res.data.Message);
      setInfo(res.data.Data);
    } catch (error) {}
  };

  return (
    <Container
      maxWidth="xs"
      sx={{
        py: 6,
      }}
    >
      <Box>
        <BarcodeScanner
          onSuccess={(text) => setData(text)}
          onError={(error) => {
            if (error) {
              console.error(error.message);
            }
          }}
          onLoad={() => console.log("Video feed has loaded!")}
          containerStyle={{ width: "100%" }}
        />
        <p>{data}</p>
      </Box>

      <Box component="form" mt={5} onSubmit={handleSubmit(onSubmit)}>
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
              ارسال
            </LoadingButton>
          </Stack>
        </FormContainer>
      </Box>

      {!!info && (
        <Card sx={{ p: 2, mt: 5 }}>
          <Stack spacing={2}>
            <InfoItem title="نام منطقه" info={info?.region} />
            <InfoItem title="لاین" info={enToFaNumber(info?.line)} />
            <InfoItem title="جایگاه" info={enToFaNumber(info?.position)} />
            <InfoItem title="شماره بسته" info={enToFaNumber(info?.id)} />
            <InfoItem title="شماره پک" info={info?.pack} />
            <Divider sx={{ my: 2 }} />
            <InfoItem title="بارکد" info={info?.barcode} />
            <InfoItem title="آدرس" info={enToFaNumber(info?.address)} />
            <InfoItem title="کد پستی" info={enToFaNumber(info?.postalCode)} />
            <InfoItem title="شماره موبایل" info={enToFaNumber(info?.phone)} />
          </Stack>
        </Card>
      )}
    </Container>
  );
};

export default HomeScreen;
