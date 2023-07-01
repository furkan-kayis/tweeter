import Head from "next/head";
import { Button, Container, Stack, TextField } from "@mui/material";
import { signInWithGoogle, signUp } from "@/firebase/auth";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/router";

const validationSchema = z
  .object({
    firstName: z.string().min(1, { message: "Firstname is required" }),
    lastName: z.string().min(1, { message: "Lastname is required" }),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
  });

type ValidationSchema = z.infer<typeof validationSchema>;

export default function SignUp() {
  const [auth] = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });
  const onSubmit: SubmitHandler<ValidationSchema> = (data, event) => {
    event?.preventDefault();
    signUp(data.firstName, data.lastName, data.email, data.password);
  };

  if (auth) {
    router.push("/");
    return null;
  }

  return (
    <>
      <Head>
        <title>Sign up - Tweeter</title>
      </Head>
      <Container sx={{ display: "grid", mt: 2, gap: 6 }}>
        <Stack component="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            placeholder="First Name"
            error={Boolean(errors.firstName)}
            helperText={errors.firstName?.message}
            {...register("firstName")}
          />
          <TextField
            placeholder="Last Name"
            error={Boolean(errors.lastName)}
            helperText={errors.lastName?.message}
            {...register("lastName")}
          />
          <TextField
            placeholder="Email"
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
            {...register("email")}
          />
          <TextField
            placeholder="Password"
            error={Boolean(errors.password)}
            helperText={errors.password?.message}
            {...register("password")}
          />
          <TextField
            placeholder="Repeat Password"
            error={Boolean(errors.confirmPassword)}
            helperText={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button variant="contained" type="submit">
            Sign up
          </Button>
        </Stack>
        <Button type="button" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
      </Container>
    </>
  );
}
