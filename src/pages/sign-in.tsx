import Head from "next/head";
import { Button, Container, Stack, TextField } from "@mui/material";
import { signIn, signInWithGoogle } from "@/firebase/auth";
import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/firebase";
import { useRouter } from "next/router";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
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
    signIn(data.email, data.password);
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
          <Button variant="contained" type="submit">
            Sign in
          </Button>
        </Stack>
        <Button type="button" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
      </Container>
    </>
  );
}
