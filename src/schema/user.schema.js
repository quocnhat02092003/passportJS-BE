import yup from "yup";

export const RegisterSchema = yup.object({
  name: yup.string().required("Name phải có"),
  password: yup
    .string()
    .required("Password phải có")
    .min(6, "Độ dài password là 6"),
  username: yup
    .string()
    .required("Username phải có")
    .min(6, "Độ dài username là 6"),
});

export const CourseSchema = yup.object({
  titleblog: yup.string().required("Title blog phải có"),
  imageblog: yup
    .string()
    .required("Link image phải có"),
  contentblog: yup
    .string()
    .required("Content phải có"),
})
