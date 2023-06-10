import { FormControl, styled } from "@mui/material";

export const StyledFormControl = styled(FormControl)(({theme}) => ({
  marginBottom: theme.spacing(2),
  width: '100%'
}))