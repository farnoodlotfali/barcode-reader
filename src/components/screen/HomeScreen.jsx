"use client";

import {
  Box,
  Card,
  Container,
  Divider,
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
import {
  boundingBox,
  centerText,
  outline,
  Scanner,
  useDevices,
} from "@yudiel/react-qr-scanner";

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

const styles = {
  container: {
    width: 400,
    margin: "auto",
  },
  controls: {
    marginBottom: 8,
  },
};

const HomeScreen = () => {
  const [data, setData] = useState("No result");
  const [info, setInfo] = useState(null);

  const [deviceId, setDeviceId] = useState(undefined);
  const [tracker, setTracker] = useState("centerText");

  const [pause, setPause] = useState(false);

  const devices = useDevices();

  function getTracker() {
    switch (tracker) {
      case "outline":
        return outline;
      case "boundingBox":
        return boundingBox;
      case "centerText":
        return centerText;
      default:
        return undefined;
    }
  }

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
        <button
          style={{ marginBottom: 5 }}
          onClick={() => setPause((val) => !val)}
        >
          {pause ? "Pause Off" : "Pause On"}
        </button>{" "}
        <div style={styles.controls}>
          <select onChange={(e) => setDeviceId(e.target.value)}>
            <option value={undefined}>Select a device</option>
            {devices.map((device, index) => (
              <option key={index} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
          <select
            style={{ marginLeft: 5 }}
            onChange={(e) => setTracker(e.target.value)}
          >
            <option value="centerText">Center Text</option>
            <option value="outline">Outline</option>
            <option value="boundingBox">Bounding Box</option>
            <option value={undefined}>No Tracker</option>
          </select>
        </div>
        <Scanner
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
          // onScan={(result) => setData(result)}
          onScan={(detectedCodes) => {
            setData(detectedCodes);
          }}
          constraints={{
            deviceId: deviceId,
          }}
          components={{
            audio: true,
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
            tracker: getTracker(),
          }}
          onError={(error) => {
            console.log(`onError: ${error}'`);
          }}
          allowMultiple={true}
          scanDelay={2000}
          // paused={pause}
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
