import * as Yup from "yup";

export const userDetailsValidator = Yup.object({
  dob: Yup.string()
    .matches(
      /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/(19|20)?\d{2}$/,
      "Please enter a valid DOB",
    )
    .required(),
  role: Yup.string().oneOf(["guide", "tourist", "host"]).required(),
  gender: Yup.string().required(),
  nationality: Yup.string().required(),
  phoneNumber: Yup.string().required(),
});
