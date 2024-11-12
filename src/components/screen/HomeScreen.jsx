"use client";

import {
  Box,
  Card,
  CircularProgress,
  Container,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { FormContainer, FormInputs } from "../form";
import { LoadingButton } from "@mui/lab";
import { INPUT_TYPES } from "@/constants/InputType";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { EndPoints } from "@/constants/EndPoints";
import { axiosApi } from "@/api/axiosApi";
import { useState } from "react";
import { enToFaNumber } from "@/utility/utils";
import { centerText, Scanner, useDevices } from "@yudiel/react-qr-scanner";
import MonochromePhotosTwoToneIcon from "@mui/icons-material/MonochromePhotosTwoTone";

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
  const [info, setInfo] = useState(null);
  const [deviceId, setDeviceId] = useState(undefined);
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    control,
  } = useForm();

  const devices = useDevices();

  const Inputs = [
    {
      type: INPUT_TYPES.TEXT,
      name: "barcode",
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

  const handleBarcodeDetect = (code) => {
    setValue("barcode", code);
    handleSubmit(onSubmit)();
  };

  const handleChangeCamera = (camera) => {
    setDeviceId(camera);
  };

  return (
    <Container maxWidth="xs">
      {isSubmitting && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 100,
            bgcolor: "#ffffff34",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            pt: 10,
            gap: 2,
          }}
        >
          <CircularProgress />
          <Typography>در حال بررسی...</Typography>
        </Box>
      )}

      <Stack
        sx={{
          position: "relative",
          height: { md: 350, xs: 290 },
          width: { md: 350, xs: 290 },
          mx: "auto",
          py: 5,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 3,
          }}
        >
          <Stack direction="row" spacing={2}>
            {devices.map((device, i) => (
              <IconButton
                key={device.deviceId}
                onClick={(e) => handleChangeCamera(device.deviceId)}
                size="small"
              >
                <Typography
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    color:
                      device.deviceId === deviceId
                        ? "secondary.main"
                        : "inherit",
                  }}
                >
                  <MonochromePhotosTwoToneIcon fontSize="small" />
                </Typography>
              </IconButton>
            ))}
          </Stack>
        </Box>
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        >
          <Scanner
            constraints={{
              deviceId: deviceId,
            }}
            formats={[
              "qr_code",
              "micro_qr_code",
              "rm_qr_code",
              "maxi_code",
              "pdf417",
              "aztec",
              "data_matrix",
              "matrix_codes",
              "dx_film_edge",
              "databar",
              "databar_expanded",
              "codabar",
              "code_39",
              "code_93",
              "code_128",
              "ean_8",
              "ean_13",
              "itf",
              "linear_codes",
              "upc_a",
              "upc_e",
            ]}
            onScan={(detectedCodes) => {
              handleBarcodeDetect(detectedCodes?.[0]?.rawValue);
            }}
            con
            components={{
              audio: true,
              onOff: true,
              torch: true,
              zoom: true,
              finder: true,
              tracker: centerText,
            }}
            onError={(error) => {
              console.log(`onError: ${error}'`);
            }}
            allowMultiple={true}
          />
        </Box>
      </Stack>

      <Box component="form" mt={16} onSubmit={handleSubmit(onSubmit)}>
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
