import { createContext, useContext } from "react";
import { FormControl, InputLabel, FormHelperText, Grid2 } from "@mui/material";

import RenderInput from "./RenderInput";
import RenderNumberInput from "./RenderNumberInput";
import { INPUT_TYPES } from "@/constants/InputType";

const FormContext = createContext({});

const FormContainer = ({ children, errors, data, setData }) => {
  return (
    <FormContext.Provider
      value={{
        errors,
        data,
        setData,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

const FormInputs = ({ children, inputs, size, sx, spacing }) => {
  const { errors } = useContext(FormContext);
  return (
    <>
      <Grid2 sx={sx} container spacing={spacing ?? 2}>
        {inputs.map((input, i) => (
          <RenderInputs
            key={input?.name + " " + i}
            input={input}
            size={size}
            errors={errors}
          />
        ))}
        {children}
      </Grid2>
    </>
  );
};

const RenderInputs = ({ input, size, errors }) => {
  if (input?.hidden) {
    return null;
  }

  if (input) {
    const inputComponent = (
      <Grid2
        size={{ xs: 12, md: 3, ...size, ...input.size }}
        {...input.sx}
        key={input.name}
      >
        {input.type === INPUT_TYPES.CUSTOM ? (
          input.customView
        ) : (
          <FormControl
            variant="outlined"
            sx={{ width: "100%" }}
            error={!!errors?.[input.name]}
          >
            <InputLabel>{input.label}</InputLabel>
            <HandleInputType input={input} />

            <FormHelperText error variant="outlined">
              {errors?.[input.name]?.message}
            </FormHelperText>
          </FormControl>
        )}
      </Grid2>
    );
    if (input.tooltip) {
      return inputComponent;
    }
    return inputComponent;
  }
};

const HandleInputType = ({ input }) => {
  switch (input.type) {
    case INPUT_TYPES.TEXT:
      return <RenderInput input={input} />;
    case INPUT_TYPES.NUMBER:
      return <RenderNumberInput input={input} />;

    default:
      return <></>;
  }
};

export { FormContainer, FormInputs };
