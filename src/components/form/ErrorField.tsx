"use client";
import { FormHelperText } from "@mui/material";
import { FieldError } from "react-hook-form";

const DisplayError = ({ error }: {error?: FieldError}) => {
  if(!error) return <></>

  return <FormHelperText>
    {error.message}
  </FormHelperText>
}

export default DisplayError;