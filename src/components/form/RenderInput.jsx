import { OutlinedInput } from "@mui/material";
import { useController } from "react-hook-form";

const RenderInput = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: input?.defaultValue,
  });

  const handleOnChanged = (e) => {
    if (input.rules?.maxLength) {
      if (e.target.value.length > input.rules?.maxLength.value) {
        return;
      }

      field.onChange(e);
    } else {
      field.onChange(e);
    }
  };

  return (
    <OutlinedInput
      inputRef={field.ref}
      value={field.value === 0 ? "0" : field.value || ""}
      type={input.type}
      label={input.label}
      placeholder={input.placeholder}
      sx={{
        width: "100%",
        visibility: input?.visible === false ? "hidden" : "visible",
      }}
      onChange={handleOnChanged}
      className={input.noInputArrow && "input-phone-number"}
      onWheel={(e) => input.noInputArrow && e.target.blur()}
      autoComplete={input.type === "password" ? "new-password" : undefined}
      error={error}
      readOnly={input.readOnly}
      endAdornment={input?.endAdornment}
      dir={input?.isLtr && "ltr"}
    />
  );
};

export default RenderInput;
