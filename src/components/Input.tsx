import { InputText, InputTextProps } from "primereact/inputtext";
import React, { useState } from "react";

interface Props
  extends Omit<
    InputTextProps & React.RefAttributes<HTMLInputElement>,
    "value" | "onChange"
  > {
  onChange?: (value: string) => any;
}

export default function Input(props: Props) {
  const [value, setValue] = useState<string>(
    props.defaultValue?.toString() ?? ""
  );

  return (
    <InputText
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        props.onChange?.(e.target.value);
      }}
    />
  );
}
