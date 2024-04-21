import { Autocomplete, Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import { Fragment } from "react";
import {
  FormField,
  InitialValuesInterface,
  ValidationSchemaInterface,
} from "../types";
import { objectLength } from "../utils";

interface PropsInterface {
  initialValues: InitialValuesInterface;
  formFields: FormField[];
  buttonText: string;
  onSubmit(values: InitialValuesInterface): void;
  loading: boolean;
  validationSchema?: ValidationSchemaInterface;
  extendForm?: JSX.Element;
}

export const BForm = ({
  initialValues,
  formFields,
  buttonText,
  onSubmit,
  loading,
  validationSchema,
  extendForm,
}: PropsInterface) => {
  const formik = useFormik({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <>
      <form className="my-4 text-bgColor" onSubmit={formik.handleSubmit}>
        {formFields.map((field) => {
          if (field.type === "option") {
            return (
              <Fragment key={field.name}>
                <Autocomplete
                  id={field.name}
                  disablePortal
                  options={field.choices}
                  defaultValue={field.defaultValue}
                  getOptionLabel={(option) => {
                    if (typeof option === "string") {
                      return option;
                    }
                    return option.label;
                  }}
                  onChange={(_e, option) => {
                    if (typeof option === "string") {
                      formik.setFieldValue(field.name, option);
                    } else formik.setFieldValue(field.name, option?.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      className="my-2 w-full"
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      onBlur={formik.handleBlur}
                      // autoFocus={index === 0}
                      value={formik.values[field.name]}
                      error={
                        field.name in formik.errors &&
                        formik.touched[field.name]
                      }
                      variant="filled"
                      autoComplete={field.name}
                    />
                  )}
                />
                {field.name in formik.errors && formik.touched[field.name] && (
                  <p className="m-2 text-red-500">
                    {formik.errors[field.name]}
                  </p>
                )}
              </Fragment>
            );
          }
          return (
            <Fragment key={field.name}>
              <TextField
                className="my-2 w-full"
                label={field.label}
                name={field.name}
                type={field.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                // autoFocus={index === 0}
                value={formik.values[field.name]}
                error={
                  field.name in formik.errors && formik.touched[field.name]
                }
                variant="filled"
                autoComplete={field.name}
              />
              {field.name in formik.errors && formik.touched[field.name] && (
                <p className="m-2 text-red-500">{formik.errors[field.name]}</p>
              )}
            </Fragment>
          );
        })}
        {extendForm}
        <Button
          className="mt-2 w-full"
          variant="contained"
          type="submit"
          color="secondary"
          disabled={loading || objectLength(formik.errors) !== 0}
        >
          {buttonText}
        </Button>
      </form>
    </>
  );
};
