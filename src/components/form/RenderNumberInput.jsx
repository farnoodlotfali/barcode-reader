import { numberWithCommas, validateNumberInput } from "@/utility/utils";
import { OutlinedInput } from "@mui/material";
import { useController } from "react-hook-form";

const RenderNumberInput = ({ input }) => {
  const {
    field,
    fieldState: { error },
    formState: {},
  } = useController({
    name: input.name,
    control: input.control,
    rules: input.rules ?? {},
    defaultValue: input?.defaultValue || "",
  });

  const handleOnChanged = (e) => {
    if (!validateNumberInput(e.target.value)) {
      return;
    }

    if (input.rules?.maxLength) {
      if (e.target.value.length > input.rules?.maxLength.value) {
        return;
      }

      field.onChange(e.target.value.replaceAll(",", ""));
    } else {
      field.onChange(e.target.value.replaceAll(",", ""));
    }
  };

  return (
    <OutlinedInput
      inputRef={field.ref}
      value={
        field.value
          ? input.splitter
            ? numberWithCommas(field.value)
            : field.value
          : ""
      }
      type={input.splitter ? "text" : "text"}
      label={input.label}
      placeholder={input.placeholder}
      sx={{
        width: "100%",
        visibility: input?.visible === false ? "hidden" : "visible",
      }}
      onChange={handleOnChanged}
      className={input.noInputArrow && "input-phone-number"}
      onWheel={(e) => input.noInputArrow && e.target.blur()}
      error={error}
      readOnly={input.readOnly}
    />
  );
};

export default RenderNumberInput;
